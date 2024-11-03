'use strict'

import Category from './category.model.js'
import Publication from '../publication/publication.model.js'

export const createCategory = async (req, res) => {
    try {
        let data = req.body
        let category = new Category(data)
        if (!category) res.status(500).send({ message: 'Error saved category' })
        await category.save()
        return res.status(201).send({ message: 'Category created successfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error creating category' })
    }
}


export const updateCategory = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let updateCategory = await Category.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updateCategory) res.status(500).send({ message: 'Error updating category' })
        return res.status(201).send({ message: 'Category updated successfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating category' })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        let idCategory = req.params.id
        let categoryToDelete = await Category.findOne({ _id: idCategory })
        if (!categoryToDelete) return res.status(404).send({ message: 'Category not found' })

        let defaultCategory = await Category.findOne({ nameCategory: 'Otros' })
        if (!defaultCategory) return res.status(404).send({ message: 'Default category "Otros" not found' })

        await Publication.updateMany(
            { category: categoryToDelete._id },
            { category: defaultCategory._id },
            { multi: true }
        )

        await categoryToDelete.deleteOne()
        return res.status(200).send({ message: 'Category deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Error while deleting category' })
    }
}

export const getCategories = async (req, res) => {
    try {
        let categories = await Category.find()
        if (categories.length == 0) return res.status(404).send({ message: 'No categories' })
        return res.status(200).send({ categories })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting categories' })
    }
}