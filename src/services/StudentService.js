const bcrypt = require('bcrypt');
const HomeworkModel = require('../models/HomeworkModel');

const StudentModel = require('../models/StudentModel');
const passwordHashCost = Number.parseInt(process.env.PASSWORD_HASH_COST, 10);

const StudentService = {};
module.exports = StudentService;

const COUNT_OF_USERS_IN_QUERY = Number.parseInt(
	process.env.COUNT_OF_USERS_IN_QUERY
);

StudentService.getStudentInfo = async (params) => {
	const {
		studentId,
		studentPublicId,
		includeId = true,
		includeHomeworks = false,
		includeAge = false,
	} = params;

	const queryParams =
		'_id firstname lastname publicId' +
		(includeHomeworks ? ' homeworks' : '') +
		(includeAge ? ' age' : '');

	if (studentId) {
		return await StudentModel.findById(studentId, queryParams)
			.exec()
			.then(async (result) => {
				if (!result) {
					throw Error('User not found');
				}
				result = result.toObject();
				if (includeHomeworks) {
					result.homeworks = await Promise.all(
						result.homeworks.map(async (homework) => {
							var homeworkInfo = await HomeworkService.getHomeworkInfo(
								homework.homeworkId
							);
							return {
								...homework,
								homeworkId: undefined,
								title: homeworkInfo.title,
								publicId: homeworkInfo.publicId,
							};
						})
					);
				}
				if (!includeId) {
					delete result._id;
				}
				return {
					...result,
					name: result.firstname + ' ' + result.lastname,
				};
			});
	} else {
		return await StudentModel.findOne(
			{ publicId: studentPublicId },
			queryParams
		)
			.exec()
			.then(async (result) => {
				if (!result) {
					throw Error('User not found');
				}
				result = result.toObject();
				if (includeHomeworks) {
					var homeworks = await Promise.all(
						result.homeworks.map(async ({ _id, ...homework }) => {
							const homeworkInfo = await HomeworkService.getHomeworkInfo(
								homework.homeworkId
							);
							return {
								...homework,
								homeworkId: undefined,
								title: homeworkInfo.title,
								publicId: homeworkInfo.publicId,
							};
						})
					);
				}
				return {
					...result,
					homeworks,
					name: result.firstname + ' ' + result.lastname,
				};
			});
	}
};

StudentService.getHomeworkInfo = async (homeworkId) => {
	return await HomeworkModel.findById(
		homeworkId,
		'-_id title description creatorId subject publicId'
	).then((result) => {
		if (!result) {
			throw Error("Can't find homework with this homeworkId");
		}
		return result.toObject();
	});
};

StudentService.getStudentProfileByTeacher = async function (studentPublicId) {
	var userDocument = await StudentModel.findOne(
		{ publicId: studentPublicId },
		'-_id'
	);
	if (!userDocument) {
		throw Error('Student not found');
	}
	return userDocument;
};

StudentService.changePassword = async function (
	studentPublicId,
	oldPassword,
	newPassword
) {
	const studentPasswordHash = await StudentModel.findOne(
		{ publicId: studentPublicId },
		'-_id passwordHash'
	)
		.exec()
		.then((result) => {
			return result.passwordHash;
		});
	const passwordsMatch = await bcrypt.compare(
		oldPassword,
		studentPasswordHash
	);
	if (!passwordsMatch) {
		throw Error('Incorrect password');
	}
	const passwordHash = await bcrypt.hash(newPassword, passwordHashCost);
	await StudentModel.findOneAndUpdate(
		{ publicId: studentPublicId },
		{
			passwordHash,
		}
	);
};

StudentService.getStudentsByName = async function (name) {
	if (name.length < 3) {
		throw Error('Too short name');
	}
	const userDocuments = await StudentModel.find(
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

StudentService.getListOfStudents = async function (sliceNumber) {
	const userDocuments = await StudentModel.find(
		{},
		'-_id publicId name'
	).limit(COUNT_OF_USERS_IN_QUERY);
	return userDocuments;
};

const HomeworkService = require('./HomeworkService');
