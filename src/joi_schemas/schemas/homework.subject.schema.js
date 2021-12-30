const Joi = require('joi');

const HomeworkSubjectSchema = Joi.string().max(16).alphanum();

module.exports = HomeworkSubjectSchema;
