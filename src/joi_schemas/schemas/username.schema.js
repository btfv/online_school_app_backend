const {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
} = require('../../constants/validation_rules.constants');
const Joi = require('joi');

const UsernameSchema = Joi.string()
  .alphanum()
  .min(USERNAME_MIN_LENGTH)
  .max(USERNAME_MAX_LENGTH);
module.exports = UsernameSchema;
