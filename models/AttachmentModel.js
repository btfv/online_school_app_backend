const mongoose = require('mongoose');
const attachmentSchema = new mongoose.Schema({
	/* extension */
	ext: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: false,
		default: null,
	},
	reference: {
		type: String,
		required: true,
	},
});

const AttachmentModel = mongoose.model('Attachment', attachmentSchema);

module.exports = AttachmentModel;
