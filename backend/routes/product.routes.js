import express from "express"
import { authenticate } from "../middlewares/auth.middleware.js"
import {
    createProductValidator,
    updateProductValidator,
    mongoIdValidator
} from "../validators/product.validator.js"
import {
    createProductController,
    getAllProductsController,
    getProductByIdController,
    updateProductController,
    deleteProductController
} from "../controllers/product.controller.js"

const router = express.Router()

router.post("/", authenticate, createProductValidator, createProductController)
router.get("/", getAllProductsController)
router.get("/:id", mongoIdValidator, getProductByIdController)
router.put("/:id", authenticate, mongoIdValidator, updateProductValidator, updateProductController)
router.delete("/:id", authenticate, mongoIdValidator, deleteProductController)

export default router
