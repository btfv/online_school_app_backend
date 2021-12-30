const Joi = require('joi');
const { MAX_TEXT_SIZE } = require('../../constants/validation_rules.constants');

const TaskConditionSchema = Joi.string().max(MAX_TEXT_SIZE);

module.exports = TaskConditionSchema;
