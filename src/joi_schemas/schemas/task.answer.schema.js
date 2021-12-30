const Joi = require('joi');

const TaskAnswerSchema = Joi.string().max(24);

module.exports = TaskAnswerSchema;
