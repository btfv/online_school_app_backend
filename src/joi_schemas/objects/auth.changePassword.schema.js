const Joi = require('joi');
const PasswordSchema = require('../schemas/password.schema');

const AuthChangePasswordSchema = Joi.object({
  oldPassword: PasswordSchema.required(),
  newPassword: PasswordSchema.required(),
});

module.exports = AuthChangePasswordSchema;
