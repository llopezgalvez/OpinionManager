import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from 'dotenv'
import userRoutes from '../src/user/user.routes.js'
import publicationRoutes from '../src/publication/publication.routes.js'
import publicationCommentRoutes from '../src/publicationComments/publicationComments.routes.js'
import categoryRoutes from '../src/category/category.routes.js'
import Category from '../src/category/category.model.js'

const app = express()
config()
const port = process.env.PORT || 3200

let createDefaultCategory = async () => {
    try {
        let existingDefaultCategory = await Category.findOne({ title: 'Otros' })

        if (!existingDefaultCategory) {
            let defaultCategory = new Category({
                nameCategory: 'Otros',
                description: 'Default category for products that do not have an assigned category'
            })

            await defaultCategory.save()
            console.log('Default category created')
        }
    } catch (error) {
        return null
    }
}

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use(helmet()) 
app.use(morgan('dev')) 

app.use('/user', userRoutes)
app.use('/publication', publicationRoutes)
app.use('/publicationComment', publicationCommentRoutes)
app.use('/category', categoryRoutes)

export const initServer = async () => {
    await createDefaultCategory()
    app.listen(port, () => {
        console.log(`Server HTTP running in port ${port}`)
    })
}