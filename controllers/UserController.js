const StudentService = require('../services/StudentService');
const TeacherService = require('../services/TeacherService');
const UserController = {};

UserController.changePassword = async function (req, res, next) {
	try {
		const publicId = req.user.publicId;
		const oldPassword = req.body.oldPassword;
		const newPassword = req.body.newPassword;
		if (req.user.isTeacher) {
			await TeacherService.changePassword(
				publicId,
				oldPassword,
				newPassword
			);
		} else {
			await StudentService.changePassword(
				publicId,
				oldPassword,
				newPassword
			);
		}
		return res.status(200).send();
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

UserController.getInfo = async (req, res, next) => {
	try {
		const userPublicId = req.params.publicId;
		const isTeacher = req.query.isTeacher === 'true';
		if (isTeacher) {
			var profile = await TeacherService.getTeacherInfo({
				teacherPublicId: userPublicId,
				includeId: false,
			});
		} else {
			var profile = await StudentService.getStudentInfo({
				studentPublicId: userPublicId,
				includeId: false,
				includeHomeworks: true,
			});
		}
		return res.status(200).json(profile);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

UserController.setUserPicture = async (req, res, next) => {
	try {
		const file = req.files ? Object.values(req.files)[0] : null;
		if (!file) {
			throw Error('There is no file');
		}
		if (file.size > 1 * 1024 * 1024) {
			throw Error('Max file size is 1 megabyte');
		}
		if (req.user.isTeacher) {
			await TeacherService.uploadProfilePicture(req.user.publicId, file);
		}
		return res.status(200).send();
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error: error.message });
	}
};

UserController.getProfile = async (req, res, next) => {
	try {
		const userPublicId = req.user.publicId;
		const isTeacher = req.user.isTeacher;

		if (isTeacher) {
			var profile = await TeacherService.getTeacherProfile(userPublicId);
		}
		return res.status(200).json(profile);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

module.exports = UserController;
