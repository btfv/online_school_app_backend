const path = require('path');
const FilesService = require('../services/FilesService');

const FilesController = {};

FilesController.getAvatar = async (req, res, next) => {
	try {
		const filePath = path.join(
			__dirname,
			'../upload_files/' + req.params.filePath
		);
		return res.sendFile(filePath);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

FilesController.getFile = async function (req, res, next) {
	/**
	 * GET
	 */
	try {
		const fileReference = req.params.fileReference;
		const file = await FilesService.getFile(fileReference);
		const fileName = file.name + '.' + file.ext;
		const filePath = path.join(
			__dirname,
			'../upload_files/' + fileReference
		);
		return res.status(200).download(filePath, fileName);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

module.exports = FilesController;
