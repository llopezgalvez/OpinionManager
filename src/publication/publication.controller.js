import Publication from './publication.model.js'
import User from '../user/user.model.js'
import PublicationComment from '../publicationComments/publicationComments.model.js'
import Category from '../category/category.model.js'
import { checkUpdatePublication } from '../utils/validator.js'
import { verifyToken } from '../utils/generateToken.js'

export const createPublication = async (req, res) => {
    try {
        //Obtengo el id del usuario que está registrado
        let userID = req.user.id
        //Obtengo la información del body
        let data = req.body

        //Verificar si existe la categoria
        let category = await Category.findById(data.category)
        if (!category) return res.status(404).send({ message: 'Category not found' })

        //Busco si existe un usuario o no existe
        let user = await User.findById(userID)
        if (!user) return res.status(404).send({ message: 'User not found' })

        //Guardo la información de la publicación
        let publication = new Publication({
            ...data, //Operador de propagación
            author: userID
        })

        //Guardo la publicación
        await publication.save()

        //Agrego el ID y el titulo de la publicación al arreglo de posts del usuario
        user.posts.push({ publication: publication.id, title: data.title })
        console.log({ publication: publication.id, title: data.title })
        //Guardo la actualización del usuario
        await user.save()

        //Respondo al usuario que se ha agregado su publicación
        return res.send({ message: 'The publication has been created', publication })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error when trying to create a publication', error })
    }
}

export const updatePublication = async (req, res) => {
    try {
        // Obtener el ID del usuario del token
        const userID = req.user.id

        // Obtener el ID de la publicación que se va a actualizar
        const { id } = req.params

        // Obtener los datos que se van a actualizar
        const data = req.body

        // Buscar la publicación por su ID
        const publication = await Publication.findById(id)

        // Verificar si la publicación existe
        if (!publication) {
            return res.status(404).send({ message: 'Publication not found' })
        }

        // Verificar si el usuario es el autor de la publicación
        if (publication.author.toString() !== userID) {
            return res.status(401).send({ message: 'You do not have permission to edit this publication' })
        }

        // Verificar si hay datos para actualizar
        if (!Object.keys(data).length) {
            return res.status(400).send({ message: 'No data provided for update' })
        }

        // Actualizar la publicación
        const updatedPublication = await Publication.findByIdAndUpdate(id, data, { new: true })

        if (!updatedPublication) {
            return res.status(500).send({ message: 'Error updating the publication' })
        }

        return res.send({ message: 'Publication updated successfully', publication: updatedPublication })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Internal server error' })
    }
}

export const deletePublication = async (req, res) => {
    try {
        const { id } = req.params
        const userID = req.user.id

        const publication = await Publication.findById(id)

        if (!publication) {
            return res.status(404).send({ message: 'Publication not found' })
        }

        if (publication.author.toString() !== userID) {
            return res.status(401).send({ message: 'You do not have permission to delete the publication' })
        }

        const deletedPublication = await Publication.findByIdAndDelete(id)

        if (!deletedPublication) {
            return res.status(404).send({ message: 'Publication not found or not deleted' })
        }

        const deletedComments = await PublicationComment.deleteMany({ publication: id })

        if (!deletedComments) {
            return res.status(500).send({ message: 'Error deleting comments related to the publication' })
        }

        const userUpdatePublications = await User.findByIdAndUpdate(
            userID,
            { $pull: { posts: { publication: id } } },
            { new: true }
        )

        if (!userUpdatePublications) {
            return res.status(500).send({ message: 'Error updating user posts array' })
        }

        return res.status(200).send({ message: 'Publication and related comments removed successfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error deleting the publication' })
    }
}

export const listPublicationAndComments = async (req, res) => {
    try {
        let userID = req.user.id
        let publications = await Publication.find({ author: userID }).select('-_id')
            .populate({ path: 'author', select: 'username -_id' })
            .populate({ path: 'category', select: 'nameCategory -_id' })

        for (let publication of publications) { //Recorriendo cada publicación en la lista de publicaciones
            for (let comment of publication.comments) { //Recorriendo cada comentario de la publicacion
                let user = await User.findById(comment.user); //Buscamos en la DB al usuario que comento la publicacion
                if (user) {
                    comment.user = user.username; // Actualizar el campo user con el nombre de usuario
                }
            }
        }
        //console.log(publications)
        if (publications) {
            return res.send({ publications })
        } else {
            return res.status(404).send({ message: 'Not found publications' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error when trying to list publications', error })
    }
}