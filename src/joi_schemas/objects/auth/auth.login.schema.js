const Joi = require('joi');
const PasswordSchema = require('../../schemas/password.schema');
const UsernameSchema = require('../../schemas/username.schema');

const AuthLoginSchema = Joi.object({
  password: PasswordSchema.required(),
  username: UsernameSchema.required(),
});

module.exports = AuthLoginSchema;
