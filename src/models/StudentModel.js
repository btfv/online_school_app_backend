const mongoose = require('mongoose');
const subjectSchema = require('./SubjectsSchema');
const homeworkSchema = require('./HomeworkSchema');
const studentSchema = new mongoose.Schema({
	publicId: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
		required: false,
	},
	passwordHash: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: false,
	},
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	//firstname + surname
	groups: [
		{
			type: mongoose.Types.ObjectId,
			required: true,
		},
	],
	subjects: [subjectSchema],
	homeworks: [homeworkSchema],
});

const StudentModel = mongoose.model('Student', studentSchema);

module.exports = StudentModel;
