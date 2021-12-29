const mongoose = require('mongoose');
const answerSchema = require('./AnswerSchema');
const solutionSchema = new mongoose.Schema({
	checkedById: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	isChecked: {
		type: Boolean,
		required: true,
		default: false,
	},
	publicId: {
		type: String,
		required: true,
	},
	studentId: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	totalPoints: {
		type: Number,
		required: true,
		default: 0,
	},
	comment: {
		type: String,
		required: false,
	},
	answers: [answerSchema],
});

module.exports = solutionSchema;
