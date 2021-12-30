const Joi = require('joi');

const TaskTypeSchema = Joi.number().integer().min(0);

module.exports = TaskTypeSchema;
