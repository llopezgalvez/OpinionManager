'use strict'

import { verifyToken } from '../utils/generateToken.js'
import { checkUpdateCommentPublication } from '../utils/validator.js'
import PublicationComment from './publicationComments.model.js'
import Publication from '../publication/publication.model.js'
import User from '../user/user.model.js'

export const createComment = async (req, res) => {
    try {
        const data = req.body
        const { id } = req.params //ID de la publicación que queremos comentar
        const userID = req.user.id

        //Verificar si el usuario que quiere hacer el comentario existe
        const userExists = await User.findById(userID);
        if (!userExists) {
            return res.status(404).send({ message: 'User not found' })
        }

        //Verificar que exista la publicación
        const publicacion = await Publication.findById(id)
        if (!publicacion) {
            return res.status(404).send({ message: 'Publication not found' })
        }

        //Crear el comentario
        const publicationComment = new PublicationComment({
            user: userID,
            publication: id,
            comment: data.comment
        })

        //Guardar el comentario
        await publicationComment.save()

        //Agregar el comentario al arreglo de comentarios de la publicación y guardarla
        publicacion.comments.push({
            _id: publicationComment._id,
            user: userID,
            comment: data.comment
        })
        await publicacion.save()

        return res.send({ message: 'Commented successfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error when commenting', error })
    }
}

export const updatePublicationComment = async (req, res) => {
    try {
        const userID = req.user.id
        const { id } = req.params
        const data = req.body

        const comment = await PublicationComment.findById(id)

        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' })
        }

        const publication = await Publication.findById(comment.publication)

        if (!publication) {
            return res.status(404).send({ message: 'Associated publication not found' })
        }

        if (publication.author.toString() !== userID) {
            return res.status(401).send({ message: 'You are not allowed to edit other users comments' })
        }

        const updateComment = await PublicationComment.findByIdAndUpdate(
            id,
            data,
            { new: true }
        )

        if (!updateComment) {
            return res.status(404).send({ message: 'Comment not found or not updated' })
        }

        return res.send({ message: 'Updated comment', updateComment })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating' })
    }
}


export const deleteComment = async (req, res) => {
    try {
        const userID = req.user.id
        const { id } = req.params

        const comment = await PublicationComment.findById(id)

        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' })
        }

        const publication = await Publication.findById(comment.publication)

        if (!publication) {
            return res.status(404).send({ message: 'Associated publication not found' })
        }

        if (publication.author.toString() !== userID) {
            return res.status(401).send({ message: 'You are not allowed to delete comments from other users' })
        }

        const deletedComment = await PublicationComment.findByIdAndDelete(id)

        if (!deletedComment) {
            return res.status(404).send({ message: 'Comment not found or not deleted' })
        }

        return res.status(200).send({ message: 'Comment deleted successfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error deleting comment' })
    }
}