const Joi = require('joi');
const { MAX_TEXT_SIZE } = require('../../constants/validation_rules.constants');

const HomeworkDescriptionSchema = Joi.string().max(MAX_TEXT_SIZE);

module.exports = HomeworkDescriptionSchema;
