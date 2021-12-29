const {
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
} = require('../../constants/validation_rules.constants');
const Joi = require('joi');

const NameSchema = Joi.string()
  .alphanum()
  .min(NAME_MIN_LENGTH)
  .max(NAME_MAX_LENGTH);
module.exports = NameSchema;
