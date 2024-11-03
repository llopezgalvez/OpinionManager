'use strict'

import express from 'express'
import {Router} from 'express'
import { validateJwt } from '../middlewares/validate-jwt.js'
import {createUser, login, updateUser} from './user.controller.js'

const api = Router()

api.post('/createUser', createUser)
api.post('/login', login)
api.put('/updateUser/:id', [validateJwt],updateUser)

export default api