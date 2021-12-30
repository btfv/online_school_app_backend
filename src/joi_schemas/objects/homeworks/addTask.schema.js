const Joi = require('joi');
const TaskConditionSchema = require('../../schemas/task.condition.schema');
const TaskAnswerSchema = require('../../schemas/task.answer.schema');
const PublicIdSchema = require('../../schemas/publicId.schema');
const TaskTypeSchema = require('../../schemas/task.type.schema');
const TaskOptionLabelsSchema = require('../../schemas/task.optionLabels.schema');

const AddTaskSchema = Joi.object({
  homeworkPublicId: PublicIdSchema.required(),
  taskType: TaskTypeSchema.required(),
  condition: TaskConditionSchema.required(),
  options: TaskOptionLabelsSchema,
  answer: TaskAnswerSchema,
  maxPoints: Joi.number().integer().min(0).required(),
});

module.exports = AddTaskSchema;
