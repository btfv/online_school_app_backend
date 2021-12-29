const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const path = require('path');
const fs = require('fs');

const TeacherModel = require('../models/TeacherModel');
const passwordHashCost = parseInt(process.env.PASSWORD_HASH_COST, 10);

const TeacherService = {};

const COUNT_OF_USERS_IN_QUERY = Number.parseInt(
	process.env.COUNT_OF_USERS_IN_QUERY
);

TeacherService.getTeacherProfile = async (publicId) => {
	return await TeacherModel.findOne(
		{ publicId, hasAccess: true },
		'-_id firstname lastname profilePictureRef'
	).then((result) => result.toObject());
};

TeacherService.getTeacherInfo = async (params) => {
	const {
		teacherId,
		teacherPublicId,
		includeId = true,
		includeAvatarRef = false,
	} = params;
	const queryParams =
		'firstname lastname publicId' +
		(!includeId ? ' -_id' : '') +
		(includeAvatarRef ? ' profilePictureRef' : '');
	if (teacherId) {
		return await TeacherModel.findById(teacherId, queryParams)
			.exec()
			.then((result) => {
				if (!result) {
					throw Error('User not found');
				}
				result = result.toObject();
				return {
					...result,
					name: result.firstname + ' ' + result.lastname,
				};
			});
	} else {
		return await TeacherModel.findOne(
			{ publicId: teacherPublicId },
			queryParams
		)
			.exec()
			.then((result) => {
				if (!result) {
					throw Error('User not found');
				}
				result = result.toObject();
				return {
					...result,
					name: result.firstname + ' ' + result.lastname,
				};
			});
	}
};

TeacherService.changePassword = async function (
	teacherPublicId,
	oldPassword,
	newPassword
) {
	const teacherPasswordHash = await TeacherModel.findOne(
		{ publicId: teacherPublicId },
		'-_id passwordHash'
	)
		.exec()
		.then((result) => {
			return result.passwordHash;
		});
	const passwordsMatch = await bcrypt.compare(
		oldPassword,
		teacherPasswordHash
	);
	if (!passwordsMatch) {
		throw Error('Incorrect password');
	}
	const passwordHash = await bcrypt.hash(newPassword, passwordHashCost);
	await TeacherModel.findOneAndUpdate(
		{ publicId: teacherPublicId },
		{
			passwordHash,
		}
	);
};

TeacherService.uploadProfilePicture = async (teacherPublicId, pictureFile) => {
	const extension = pictureFile.name.split('.').pop();
	if (extension !== 'png' && extension !== 'jpg' && extension !== 'jpeg') {
		throw Error('png, jpg, jpeg formats are available only');
	}
	await TeacherModel.findOne(
		{ publicId: teacherPublicId },
		'profilePictureRef'
	).then(async (result) => {
		if (!result) {
			throw Error('Teacher not found');
		}
		if (result.profilePictureRef) {
			const filePath = path.join(
				__dirname,
				'../upload_files/' + result.profilePictureRef
			);
			fs.unlink(filePath, (err) => {
				if (err) throw Error(err);
			});
		}
	});

	const fileName = nanoid(10) + Date.now().toString() + '.' + extension;
	await pictureFile.mv('./upload_files/' + fileName);
	await TeacherModel.findOneAndUpdate(
		{ publicId: teacherPublicId },
		{ profilePictureRef: fileName }
	);
};

TeacherService.getTeachersByName = async function (name) {
	if (name.length < 3) {
		throw Error('Too short name');
	}
	const userDocuments = await TeacherModel.find(
		{
			$or: [
				{ firstname: new RegExp(name, 'i') },
				{ lastname: new RegExp(name, 'i') },
			],
		},
		'-_id firstname lastname publicId'
	)
		.limit(COUNT_OF_USERS_IN_QUERY)
		.exec();
	return userDocuments;
};

module.exports = TeacherService;
