const Joi = require('joi');
const NameSchema = require('../schemas/name.schema');
const PasswordSchema = require('../schemas/password.schema');
const UsernameSchema = require('../schemas/username.schema');
const AgeSchema = require('../schemas/age.schema');

const AuthLoginSchema = Joi.object({
  password: PasswordSchema,
  username: UsernameSchema,
});

module.exports = AuthLoginSchema;
