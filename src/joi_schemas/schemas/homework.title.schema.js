const Joi = require('joi');

const HomeworkTitleSchema = Joi.string().min(2).max(24).alphanum();

module.exports = HomeworkTitleSchema;
