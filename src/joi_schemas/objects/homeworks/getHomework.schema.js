const Joi = require('joi');
const PublicIdSchema = require('../../schemas/publicId.schema');

const GetHomeworkSchema = Joi.object({ homeworkPublicId: PublicIdSchema.required() });

module.exports = GetHomeworkSchema;
