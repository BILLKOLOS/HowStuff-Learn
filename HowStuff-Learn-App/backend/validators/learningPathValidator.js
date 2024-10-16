// validators/learningPathValidator.js
const Joi = require('joi');

// Define the schema for validating learning paths
const learningPathSchema = Joi.object({
    userId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/) // Regex for MongoDB ObjectId format
        .required()
        .messages({
            'string.empty': 'User ID is required',
            'string.pattern.base': 'User ID must be a valid ObjectId',
        }),
    title: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Title is required',
            'string.min': 'Title must be at least 3 characters long',
            'string.max': 'Title must be less than or equal to 100 characters',
        }),
    description: Joi.string()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Description must be less than or equal to 500 characters',
        }),
    modules: Joi.array()
        .items(Joi.object({
            title: Joi.string()
                .required()
                .messages({
                    'string.empty': 'Module title is required',
                }),
            content: Joi.string()
                .required()
                .messages({
                    'string.empty': 'Module content is required',
                }),
            order: Joi.number()
                .integer()
                .min(1)
                .required()
                .messages({
                    'number.base': 'Order must be a number',
                    'number.integer': 'Order must be an integer',
                    'number.min': 'Order must be at least 1',
                }),
        }))
        .required()
        .messages({
            'array.base': 'Modules must be an array',
            'array.empty': 'At least one module is required',
        }),
});

// Validate the learning path data
const validateLearningPath = (data) => {
    return learningPathSchema.validate(data, { abortEarly: false }); // Abort early can be set to false to collect all errors
};

module.exports = { validateLearningPath };
