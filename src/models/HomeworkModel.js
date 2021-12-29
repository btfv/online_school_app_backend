const mongoose = require('mongoose');
const taskSchema = require('./TaskSchema');
const solutionSchema = require('./SolutionSchema');

const homeworkSchema = new mongoose.Schema({
	publicId: {
		type: String,
		required: true,
	},
	//nanoid
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
		default: null,
	},
	subject: {
		type: String,
		required: true,
	},
	creatorId: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	creatorPublicId: {
		type: String,
		required: true,
	},
	teachersWithAccess: [
		{
			type: mongoose.Types.ObjectId,
			required: true,
		},
	],
	attachments: [
		{
			type: mongoose.Types.ObjectId,
			required: true,
		},
	],
	tasks: [taskSchema],
	receivedStudents: [
		{
			studentPublicId: {
				type: String,
				required: true,
			},
			studentId: {
				type: mongoose.Types.ObjectId,
				required: true,
			},
			hasSolution: {
				type: Boolean,
				required: true,
				default: false,
			},
			solutionPublicId: {
				type: String,
				required: false,
				default: null,
			},
			deadline: {
				type: Date,
				required: false,
				default: 0,
			},
			isChecked: {
				type: Boolean,
				default: false,
			},
		},
	],
	//publicids of users who received that homework
	receivedGroups: [
		{
			groupPublicId: {
				type: String,
				required: true,
			},
			groupName: {
				type: String,
				required: true,
			},
		},
	],
	//publicids of groups who received that homework
	solutions: [solutionSchema],
	hasDetailedTasks: {
		type: Boolean,
		required: true,
		default: false,
	},
	homeworkMaxPoints: {
		type: Number,
		required: true,
		default: 0,
	},
});

const HomeworkModel = mongoose.model('Homework', homeworkSchema);

module.exports = HomeworkModel;
