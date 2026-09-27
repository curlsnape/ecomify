import { body, param, validationResult } from "express-validator"

function handleValidation(req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Invalid Request",
            errors: errors.array()
        })
    }

    next()
}

export const createProductValidator = [
    body("name")
        .exists().withMessage("Name is required").bail()
        .isString().withMessage("Name must be a string")
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),
    body("description")
        .optional()
        .isString().withMessage("Description must be a string")
        .trim()
        .isLength({ max: 1000 }).withMessage("Description must be under 1000 characters"),
    body("price")
        .exists().withMessage("Price is required").bail()
        .isFloat({ min: 0 }).withMessage("Price must be a number greater than or equal to 0"),
    body("stock")
        .optional()
        .isInt({ min: 0 }).withMessage("Stock must be a whole number greater than or equal to 0"),
    handleValidation
]


export const updateProductValidator = [
    body("name")
        .optional()
        .isString().withMessage("Name must be a string")
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),
    body("description")
        .optional()
        .isString().withMessage("Description must be a string")
        .trim()
        .isLength({ max: 1000 }).withMessage("Description must be under 1000 characters"),
    body("price")
        .optional()
        .isFloat({ min: 0 }).withMessage("Price must be a number greater than or equal to 0"),
    body("stock")
        .optional()
        .isInt({ min: 0 }).withMessage("Stock must be a whole number greater than or equal to 0"),
    handleValidation
]


export const mongoIdValidator = [
    param("id")
        .isMongoId().withMessage("Invalid product id"),
    handleValidation
]
