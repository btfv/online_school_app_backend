const Joi = require('joi');

const AgeSchema = Joi.number().min(6).max(99);
module.exports = AgeSchema;
