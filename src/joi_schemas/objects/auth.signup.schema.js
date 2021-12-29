const Joi = require('joi');
const NameSchema = require('../schemas/name.schema');
const PasswordSchema = require('../schemas/password.schema');
const UsernameSchema = require('../schemas/username.schema');
const AgeSchema = require('../schemas/age.schema');
const EmailSchema = require('../schemas/email.schema');

const AuthSignupSchema = Joi.object({
  password: PasswordSchema,
  firstname: NameSchema,
  lastname: NameSchema,
  username: UsernameSchema,
  age: AgeSchema,
  email: EmailSchema,
});

module.exports = AuthSignupSchema;
