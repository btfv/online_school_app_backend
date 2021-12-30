const Joi = require('joi');
const PublicIdSchema = require('../../schemas/publicId.schema');
const DateSchema = require('../../schemas/date.schema');

const SendHomeworkSchema = Joi.object({
  studentPublicId: PublicIdSchema.required(),
  homeworkPublicId: PublicIdSchema.required(),
  deadline: DateSchema,
});

module.exports = SendHomeworkSchema;
