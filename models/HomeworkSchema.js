const mongoose = require('mongoose');
const homeworkSchema = new mongoose.Schema({
	homeworkId: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	solutionPublicId: {
		type: String,
		required: false,
		default: null,
	},
	hasSolution: {
		type: Boolean,
		required: true,
		default: false,
	},
	isChecked: {
		type: Boolean,
		required: true,
		default: false,
	},
	deadline: {
		type: Date,
		required: false,
		default: 0,
	},
});
module.exports = homeworkSchema;
