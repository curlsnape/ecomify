import productModel from "../models/product.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"

export const createProductController = asyncHandler(async (req, res) => {
    const { name, description, price, stock } = req.body

    const product = await productModel.create({
        name,
        description,
        price,
        stock,
        createdBy: req.user._id
    })

    return res.status(201).json({ message: "Product created successfully", product })
})

export const getAllProductsController = asyncHandler(async (req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.min(parseInt(req.query.limit) || 10, 50)

    const products = await productModel
        .find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)

    const total = await productModel.countDocuments()

    return res.status(200).json({
        products,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
})

export const getProductByIdController = asyncHandler(async (req, res) => {
    const product = await productModel.findById(req.params.id)

    if (!product) {
        return res.status(404).json({ message: "Product not found" })
    }

    return res.status(200).json({ product })
})

export const updateProductController = asyncHandler(async (req, res) => {
    const product = await productModel.findById(req.params.id)

    if (!product) {
        return res.status(404).json({ message: "Product not found" })
    }

    const { name, description, price, stock } = req.body

    if (name !== undefined) product.name = name
    if (description !== undefined) product.description = description
    if (price !== undefined) product.price = price
    if (stock !== undefined) product.stock = stock

    await product.save()

    return res.status(200).json({ message: "Product updated successfully", product })
})

export const deleteProductController = asyncHandler(async (req, res) => {
    const product = await productModel.findById(req.params.id)

    if (!product) {
        return res.status(404).json({ message: "Product not found" })
    }

    await product.deleteOne()

    return res.status(200).json({ message: "Product deleted successfully" })
})
