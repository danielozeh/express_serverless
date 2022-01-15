const Joi = require("joi");

module.exports = {
    register: Joi.object({
        email: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        confirm_password: Joi.string().required()
    }),

    login: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
}