'use strict'

import {Router} from 'express'
import {validateJwt} from '../middlewares/validate-jwt.js'
import {createPublication, updatePublication, deletePublication, listPublicationAndComments} from './publication.controller.js'

const api = Router()

api.post('/createPublication', [validateJwt], createPublication)
api.put('/updatePublication/:id', [validateJwt], updatePublication)
api.delete('/deletePublication/:id', [validateJwt], deletePublication)
api.get('/getPublications', [validateJwt], listPublicationAndComments)

export default api