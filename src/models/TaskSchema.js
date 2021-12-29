const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
	publicId: {
		type: String,
		required: true,
	},
	//nanoid
	taskType: {
		type: Number,
		required: true,
	},
	//answer is 1 - option from list, 2 - string, 3 - detailed
	condition: {
		type: String,
		required: true,
	},
	optionLabels: [
		{
			type: String,
			required: true,
		},
	],
	optionAnswers: [{ type: Boolean, required: true }],
	stringAnswer: {
		type: String,
		required: false,
	},
	detailedAnswer: {
		type: String,
		required: false,
	},
	attachments: [
		{
			type: mongoose.Types.ObjectId,
			required: true,
		},
	],
	maxPoints: {
		type: Number,
		required: false,
		default: 0,
	},
	//how much student receives when right solved task
});
module.exports = taskSchema;
