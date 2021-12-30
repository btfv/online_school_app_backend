const Joi = require('joi');
const HomeworkDescriptionSchema = require('../../schemas/homework.description.schema');
const HomeworkTitleSchema = require('../../schemas/homework.title.schema');
const HomeworkSubjectSchema = require('../../schemas/homework.subject.schema');

const CreateHomeworkSchema = Joi.object({
  homeworkTitle: HomeworkTitleSchema.required(),
  homeworkDescription: HomeworkDescriptionSchema,
  homeworkSubject: HomeworkSubjectSchema,
  // homeworkAttachments,
});

module.exports = CreateHomeworkSchema;
