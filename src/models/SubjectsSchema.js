const mongoose = require('mongoose');
const subjectsSchema = new mongoose.Schema({
	subjectId: {
		type: Number,
		required: true,
	},
	accessUntil: {
		type: Date,
		required: false,
		default: null,
	},
});
module.exports = subjectsSchema;
