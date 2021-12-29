const Joi = require('joi');
const PasswordSchema = require('../schemas/password.schema');

const AuthChangePasswordSchema = Joi.object({
  oldPassword: PasswordSchema,
  newPassword: PasswordSchema,
});

module.exports = AuthChangePasswordSchema;
