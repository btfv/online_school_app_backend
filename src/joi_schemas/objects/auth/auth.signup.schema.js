const Joi = require('joi');
const NameSchema = require('../../schemas/name.schema');
const PasswordSchema = require('../../schemas/password.schema');
const UsernameSchema = require('../../schemas/username.schema');
const AgeSchema = require('../../schemas/age.schema');
const EmailSchema = require('../../schemas/email.schema');

const AuthSignupSchema = Joi.object({
  password: PasswordSchema.required(),
  firstname: NameSchema.required(),
  lastname: NameSchema.required(),
  username: UsernameSchema.required(),
  age: AgeSchema.required(),
  email: EmailSchema.required(),
});

module.exports = AuthSignupSchema;
