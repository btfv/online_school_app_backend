const Joi = require('joi');
const { MAX_OPTIONS, MAX_TEXT_SIZE } = require('../../constants/validation_rules.constants');

const TaskOptionLabelsSchema = Joi.array()
  .items(Joi.string().min(1).max(MAX_TEXT_SIZE).required())
  .max(MAX_OPTIONS);

module.exports = TaskOptionLabelsSchema;
