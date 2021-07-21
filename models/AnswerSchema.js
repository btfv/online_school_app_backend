const mongoose = require('mongoose');
const answerSchema = new mongoose.Schema({
	publicId: {
		type: String,
		required: true,
	},
	detailedAnswer: {
		type: String,
		required: false,
	},
	//detailed answer
	optionAnswers: [
		{
			type: Boolean,
			required: false,
		},
	],
	//answer for option
	stringAnswer: {
		type: String,
		required: false,
	},
	//string answer
	attachments: [
		{
			type: mongoose.Types.ObjectId,
			required: true,
		},
	],
	comment: {
		type: String,
		required: false,
		default: '',
	},
	points: {
		type: Number,
		required: false,
		default: 0,
	},
	taskPublicId: {
		type: String,
		required: true,
	}
});

module.exports = answerSchema;
