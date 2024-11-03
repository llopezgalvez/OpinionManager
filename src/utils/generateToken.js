'use strict'

import jwt from 'jsonwebtoken'

const secretKey = "@IN6AVLlaveSuperSecreta1234567@"

export const generateToken = async(payload) =>{
    try {
        return jwt.sign(payload, secretKey, {
            expiresIn: '30d',
            algorithm: 'HS256'
        })
    } catch (error) {
        console.error(error)
        return error
    }
}

export const verifyToken = async(token) =>{
    try {
        return jwt.verify(token, process.env.SECRET_KEY)
    } catch (error) {
        return null
    }
}