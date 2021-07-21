const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
	publicId: {
		type: String,
		required: true,
	},
	profilePictureRef: {
		type: String,
		required: false,
		default: undefined,
	},
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	passwordHash: {
		type: String,
		required: true,
	},
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	hasAccess: {
		type: Boolean,
		required: true,
		default: false,
	},
	homeworks: [
		{
			type: mongoose.Types.ObjectId,
			required: true,
		},
	],
});

const TeacherModel = mongoose.model('Teacher', teacherSchema);

module.exports = TeacherModel;
