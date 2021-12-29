const {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} = require('../../constants/validation_rules.constants');
const Joi = require('joi');

const PasswordSchema = Joi.string()
  .alphanum()
  .min(PASSWORD_MIN_LENGTH)
  .max(PASSWORD_MAX_LENGTH);
module.exports = PasswordSchema;
