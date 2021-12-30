const Joi = require('joi');

const OffsetSchema = Joi.number().integer().min(0);

module.exports = OffsetSchema;
