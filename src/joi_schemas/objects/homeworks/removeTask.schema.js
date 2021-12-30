const Joi = require('joi');
const PublicIdSchema = require('../../schemas/publicId.schema');

const RemoveTaskSchema = Joi.object({
  homeworkPublicId: PublicIdSchema.required(),
  taskPublicId: PublicIdSchema.required(),
});

module.exports = RemoveTaskSchema;
