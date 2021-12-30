const Joi = require('joi');
const PublicIdSchema = require('../../schemas/publicId.schema');

const RemoveHomeworkSchema = Joi.object({ homeworkPublicId: PublicIdSchema.required() });

module.exports = RemoveHomeworkSchema;
