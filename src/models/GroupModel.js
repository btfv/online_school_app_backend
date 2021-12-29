const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
	publicId: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	students: [
		{
			type: mongoose.Types.ObjectId,
			required: true,
		},
	],
	homeworks: [
		{
			type: String,
			required: true,
		},
	],
	//homeworks public ids
});

const GroupModel = mongoose.model('User', groupSchema);

module.exports = GroupModel;
