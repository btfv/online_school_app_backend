const Joi = require('joi');

const EmailSchema = Joi.string().email();

module.exports = EmailSchema;
