const Joi = require('joi');

const PublicIdSchema = Joi.string()
  .length(21)
  .regex(/([A-Za-z0-9_-])\w+/);
// nanoid

module.exports = PublicIdSchema;
