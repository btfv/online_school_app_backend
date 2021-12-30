const Joi = require('joi');
const OffsetSchema = require('../../schemas/offset.schema');

const GetListOfHomeworksSchema = Joi.object({
  offset: OffsetSchema,
});

module.exports = GetListOfHomeworksSchema;
