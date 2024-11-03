'use strict'

import {Router} from 'express'
import {createComment, updatePublicationComment, deleteComment} from './publicationComments.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.post('/createComment/:id', [validateJwt], createComment)
api.put('/updateComment/:id', [validateJwt], updatePublicationComment)
api.delete('/deleteComment/:id', [validateJwt], deleteComment)

export default api