'use strict'

import User from './user.model.js'
import { checkPassword, checkUpdate, encrypt } from '../utils/validator.js'
import { generateToken } from '../utils/generateToken.js'
import { compare } from 'bcrypt'

export const createUser = async (req, res) => {
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        let user = new User(data)
        await user.save()
        return res.send({ message: 'Registered successfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error registering user', error })
    }
}

export const login = async (req, res) => {
    try {
        let { username, phone, mail, password } = req.body
        let user = await User.findOne({ $or: [{ username: username }, { phone: phone }, { mail: mail }, { password: password }] })
        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name
            }
            let token = await generateToken(loggedUser)

            return res.send({
                message: `Welcome ${loggedUser.name}`,
                loggedUser,
                token
            })
        }
        return res.status(404).send({ message: 'Invalid credentials' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error logging', error })
    }
}

export const updateUser = async (req, res) => {
    try {
        let userID = req.user.id
        let { id } = req.params
        let data = req.body
        let { oldPassword, newPassword } = req.body

        if (userID == id) {
            let user = await User.findById(id)
            if (!user) return res.status(404).send({ message: 'User not found' })

            // Verifica si se está actualizando la contraseña
            if (oldPassword && newPassword) {
                let passwordCorrect = await checkPassword(oldPassword, user.password)
                if (!passwordCorrect) {
                    return res.status(401).send({ message: 'Old password incorrect' })
                }

                // Se encripta la nueva contraseña
                data.password = await encrypt(newPassword)
            }

            let update = checkUpdate(data, id)
            if (!update) return res.status(400).send({ message: 'There are empty fields' })

            let updateUser = await User.findByIdAndUpdate(
                { _id: id },
                data,
                { new: true }
            )
            if (!updateUser) return res.status(401).send({ message: 'User not found and not updated' })
            return res.send({ message: 'Updated user', updateUser })
        } else {
            return res.status(403).send({ message: 'Editing other profiles is not allowed' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating user', error })
    }
}