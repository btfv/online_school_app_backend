const { nanoid } = require('nanoid');
const HomeworkModel = require('../models/HomeworkModel');
const StudentModel = require('../models/StudentModel');
const TeacherModel = require('../models/TeacherModel');
const GroupModel = require('../models/GroupModel');
const FilesService = require('./FilesService');
const TeacherService = require('./TeacherService');
const HomeworkService = {};
module.exports = HomeworkService;

const HOMEWORKS_PER_REQUEST = 6;
/* how much homeworks can server send per one request */
const SOLUTIONS_PER_REQUEST = 6;
/* how much solutions can server send per one request */
const STUDENTS_PER_REQUEST = 10;

HomeworkService.typesOfAnswers = {
	OPTIONS_ANSWER: 1,
	STRING_ANSWER: 2,
	DETAILED_ANSWER: 3,
};

HomeworkService.checkTeacherPermission = async function (
	teacherPublicId,
	homeworkPublicId
) {
	const teacherDocument = await TeacherModel.findOne(
		{ publicId: teacherPublicId },
		{ homeworks: { $elemMatch: homeworkPublicId } }
	).select('_id');
	if (teacherDocument) {
		return true;
	} else {
		return false;
	}
};

HomeworkService.checkStudentPermission = async function (
	studentPublicId,
	homeworkPublicId
) {
	const studentDocument = await StudentModel.findOne(
		{ publicId: studentPublicId },
		{ homeworks: { $elemMatch: { homeworkPublicId } } }
	).select('_id');
	if (studentDocument) {
		return true;
	} else {
		return false;
	}
};

HomeworkService.getPreviewsByStudent = async function (
	studentPublicId,
	offset
) {
	const homeworkPreviews = await StudentModel.findOne(
		{ publicId: studentPublicId },
		{
			homeworks: {
				$slice: [offset, offset + HOMEWORKS_PER_REQUEST],
			},
		}
	)
		.select('-_id homeworks')
		.exec()
		.then(async (studentDocument) => {
			const previews = await Promise.all(
				studentDocument.homeworks.map(async (homeworkDocument) => {
					const homeworkId = homeworkDocument.homeworkId;
					const homeworkInfo = await HomeworkService.getHomeworkInfo(
						homeworkId
					);
					const creatorId = homeworkInfo.creatorId;
					const creatorInfo = await TeacherService.getTeacherInfo({
						teacherId: creatorId,
					});
					return {
						title: homeworkInfo.title,
						description: homeworkInfo.description,
						subject: homeworkInfo.subject,
						homeworkPublicId: homeworkInfo.publicId,
						solutionPublicId: homeworkDocument.solutionPublicId,
						hasSolution: homeworkDocument.hasSolution,
						isChecked: homeworkDocument.isChecked,
						creatorName: creatorInfo.name,
						creatorPublicId: creatorInfo.publicId,
					};
				})
			);
			if (!previews.length) {
				throw Error("You don't have homeworks");
			}
			return previews;
		});
	return homeworkPreviews;
};

HomeworkService.getByStudent = async function (
	homeworkPublicId,
	studentPublicId
) {
	return await HomeworkModel.findOne({
		publicId: homeworkPublicId,
	})
		.select(
			'title subject creatorId publicId description attachments tasks deadline'
		)
		.then(async (result) => {
			result = result.toObject();
			await StudentModel.findOne(
				{
					publicId: studentPublicId,
				},
				{
					homeworks: {
						$elemMatch: {
							homeworkId: result._id,
							hasSolution: true,
						},
					},
				}
			).then((result) => {
				if (!result) {
					throw Error('Student not found');
				}
				if (result.homeworks.length) {
					throw Error('You have solution, please, wait for check');
				}
			});
			const attachments = await Promise.all(
				result.attachments.map(async (attachment) => {
					return await FilesService.getFileInfo(attachment);
				})
			);
			const creatorInfo = await TeacherService.getTeacherInfo({
				teacherId: result.creatorId,
				includeId: false,
				includeAvatarRef: true,
			});
			const tasks = result.tasks.map(
				({
					_id,
					optionAnswers,
					detailedAnswer,
					stringAnswer,
					number,
					...task
				}) => task
			);
			const { creatorId, _id, ...homework } = result;
			return {
				...homework,
				attachments,
				tasks,
				creatorInfo,
			};
		});
};

HomeworkService.getPreviewsByTeacher = async function (
	teacherPublicId,
	offset
) {
	const homeworkPreviews = await TeacherModel.findOne(
		{ publicId: teacherPublicId },
		{
			homeworks: {
				$slice: [offset, offset + HOMEWORKS_PER_REQUEST],
			},
		}
	)
		.select('_id homeworks')
		.exec()
		.then(async (teacherDocument) => {
			if (teacherDocument.homeworks.length == 0) {
				throw Error("You don't have any homeworks");
			}
			return await Promise.all(
				teacherDocument.homeworks.map(async (homeworkId) => {
					const homeworkInfo = await HomeworkService.getHomeworkInfo(
						homeworkId
					);
					const creatorInfo = await TeacherService.getTeacherInfo({
						teacherId: homeworkInfo.creatorId,
					});
					return {
						title: homeworkInfo.title,
						description: homeworkInfo.description,
						subject: homeworkInfo.subject,
						homeworkPublicId: homeworkInfo.publicId,
						creatorName: creatorInfo.name,
						creatorPublicId: creatorInfo.publicId,
					};
				})
			);
		});
	return homeworkPreviews;
};

HomeworkService.getByTeacher = async function (homeworkPublicId) {
	const homeworkDocument = await HomeworkModel.findOne({
		publicId: homeworkPublicId,
	})
		.select('-_id -tasks._id')
		.then(async (result) => {
			if (!result) {
				throw Error("Homework doesn't exist");
			}
			result = result.toObject();
			const creatorId = result.creatorId;
			const attachments = await Promise.all(
				result.attachments.map(async (attachment) => {
					return await FilesService.getFileInfo(attachment);
				})
			);
			const creatorInfo = await TeacherService.getTeacherInfo({
				teacherId: creatorId,
			});
			const tasks = result.tasks.map((task) => {
				let answer;
				switch (task.taskType) {
					case 1:
						answer = task.optionAnswers;
						break;
					case 2:
						answer = task.stringAnswer;
						break;
					case 3:
						answer = task.detailedAnswer;
						break;
				}
				return {
					taskType: task.taskType,
					publicId: task.publicId,
					answer,
					condition: task.condition,
					maxPoints: task.maxPoints,
					options:
						task.taskType === 1 ? task.optionLabels : undefined,
				};
			});
			return {
				title: result.title,
				publicId: homeworkPublicId,
				subject: result.subject,
				creatorPublicId: creatorInfo.publicId,
				creatorName: creatorInfo.name,
				description: result.description,
				attachments,
				tasks,
			};
		});
	return homeworkDocument;
};
HomeworkService.createHomework = async function (
	title,
	description,
	subject,
	creatorPublicId,
	attachments
) {
	const creatorInfo = await TeacherService.getTeacherInfo({
		teacherPublicId: creatorPublicId,
	});
	const creatorId = creatorInfo._id;
	if (attachments && attachments.length > 0) {
		var attachmentIds = await Promise.all(
			attachments.map(async (attachment) => {
				return await FilesService.uploadFile(attachment);
			})
		);
	}
	const publicId = nanoid();
	await HomeworkModel.create({
		title,
		subject,
		description,
		creatorPublicId,
		creatorId,
		publicId,
		attachments: attachmentIds,
	}).then(async (result) => {
		await TeacherModel.findByIdAndUpdate(creatorId, {
			$push: { homeworks: result._id },
		});
	});
	return publicId;
};

HomeworkService.sendHomework = async function (
	studentPublicId,
	homeworkPublicId,
	deadline
) {
	const homeworkId = await HomeworkModel.findOne(
		{
			publicId: homeworkPublicId,
		},
		{
			receivedStudents: {
				$elemMatch: {
					studentPublicId,
				},
			},
		}
	)
		.exec()
		.then((result) => {
			if (result.receivedStudents.length) {
				throw Error('This student already has this homework');
			}
			return result._id;
		});
	const studentId = await StudentModel.findOne(
		{ publicId: studentPublicId },
		'_id'
	).then((result) => {
		return result._id;
	});
	await StudentModel.findOneAndUpdate(
		{ publicId: studentPublicId },
		{
			$push: {
				homeworks: { homeworkId, deadline },
			},
		}
	);
	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{
			$push: {
				receivedStudents: { studentId, studentPublicId, deadline },
			},
		}
	);
	return true;
};

HomeworkService.addGroup = async function (groupPublicId, homeworkPublicId) {
	await GroupModel.findOneAndUpdate(
		{ publicId: groupPublicId },
		{
			$push: { homeworks: homeworkPublicId },
		}
	);
	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{
			$push: { receivedGroups: groupPublicId },
		}
	);
};

HomeworkService.addTask = async function (homeworkPublicId, task, attachments) {
	/*
		task:{_id, type, text, attachments, options, stringAnswer, detailedAnswer, maxPoints}
	*/

	if (isNaN(task.points) || parseInt(task.points) < 0) {
		throw Error("Points for task can't be negative");
	}
	if (task.taskType === 2 && (!task.answer || 0 === task.answer.length)) {
		throw Error("String answer can't be empty");
	}
	await HomeworkModel.findOne(
		{ publicId: homeworkPublicId },
		'receivedStudents'
	).then((result) => {
		if (!result) {
			throw Error('Homework not found');
		}
		if (result.receivedStudents.length) {
			throw Error(
				"You can't add task to the homework someone has received"
			);
		}
	});
	var attachmentIds = [];
	if (attachments !== 'undefined' && attachments) {
		attachmentIds = await Promise.all(
			attachments.map(async (attachment) => {
				return await FilesService.uploadFile(attachment);
			})
		);
	}
	const publicId = nanoid();

	if (task.options) {
		task.options = task.options.map((option) => {
			return option || false;
		});
	}

	const taskDocument = {
		publicId,
		taskType: task.taskType,
		condition: task.text,
		attachments: attachmentIds,
		optionLabels:
			task.taskType == this.typesOfAnswers.OPTIONS_ANSWER
				? task.options
				: [],
		optionAnswers:
			task.taskType == this.typesOfAnswers.OPTIONS_ANSWER
				? task.answer
				: [],
		stringAnswer:
			task.taskType == this.typesOfAnswers.STRING_ANSWER
				? task.answer
				: '',
		detailedAnswer:
			task.taskType == this.typesOfAnswers.DETAILED_ANSWER
				? task.answer
				: '',
		maxPoints: parseInt(task.points),
	};
	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{
			$push: {
				tasks: taskDocument,
			},
			$inc: {
				homeworkMaxPoints: parseInt(task.points),
			},
		}
	);
};

HomeworkService.removeTask = async function (homeworkPublicId, taskPublicId) {
	await HomeworkModel.findOne(
		{ publicId: homeworkPublicId },
		'receivedStudents'
	).then((result) => {
		if (result.receivedStudents.length) {
			throw Error(
				"You can't remove task from the homework someone has received"
			);
		}
	});

	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{
			$pull: { tasks: { publicId: taskPublicId } },
		}
	)
		.select('tasks')
		.then(async (document) => {
			if (!document.tasks) throw Error('Task not found');
			const task = document.tasks[0];
			await HomeworkModel.findOneAndUpdate(
				{ publicId: homeworkPublicId },
				{
					$inc: {
						homeworkMaxPoints: -task.maxPoints,
					},
				}
			);
		});
};

HomeworkService.removeStudent = async function (
	studentPublicId,
	homeworkPublicId
) {
	const homeworkId = await HomeworkModel.findOneAndUpdate(
		{
			publicId: homeworkPublicId,
		},
		{
			$pull: { receivedStudents: { studentPublicId } },
		}
	).then(async (document) => {
		const removedDocument = document.receivedStudents.filter((item) => {
			if (item.studentPublicId == studentPublicId) {
				return item;
			}
		})[0];
		if (!removedDocument) {
			throw Error("This user hasn't received this homework");
		}
		if (removedDocument.hasSolution) {
			const { solutionId } = removedDocument;
			await HomeworkModel.findOneAndUpdate(
				{ publicId: homeworkPublicId },
				{ $pull: { solutions: { _id: solutionId } } }
			);
		}
		return document._id;
	});
	await StudentModel.findOneAndUpdate(
		{ publicId: studentPublicId },
		{ $pull: { homeworks: { homeworkId } } }
	);
};

HomeworkService.removeGroup = async function (groupPublicId, homeworkPublicId) {
	await GroupModel.findOneAndUpdate(
		{ publicId: groupPublicId },
		{ $pull: { homeworks: homeworkPublicId } }
	);
	await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{ $pull: { receivedGroups: { groupPublicId } } }
	);
};

HomeworkService.removeHomework = async function (homeworkPublicId) {
	await HomeworkModel.findOne({
		publicId: homeworkPublicId,
	})
		.select('receivedStudents receivedGroups creatorId attachments')
		.then(async (homeworkDocument) => {
			const attachments = homeworkDocument.attachments;
			const creatorId = homeworkDocument.creatorId;
			const homeworkId = homeworkDocument._id;
			attachments.map(async (attachmentId) => {
				await FilesService.removeFile(attachmentId);
			});
			const students = homeworkDocument.receivedStudents;
			students.map(async (student) => {
				await HomeworkService.removeStudent(
					student.studentPublicId,
					homeworkPublicId
				);
			});
			/*
				const groups = homeworkDocument.receivedGroups;
				groups.map(async (group) => {
					await HomeworkService.removeGroup(
						group.groupPublicId,
						homeworkPublicId
					);
				});
			*/
			await TeacherModel.findOneAndUpdate(
				{ _id: creatorId },
				{
					$pull: { homeworks: homeworkId },
				}
			);
			await HomeworkModel.findByIdAndRemove(homeworkId);
		});

	return true;
};

HomeworkService.checkSolution = async function (
	homeworkPublicId,
	solutionPublicId,
	values,
	checkedByPublicId
) {
	const teacherInfo = await TeacherService.getTeacherInfo({
		teacherPublicId: checkedByPublicId,
		includeId: true,
	});
	await HomeworkModel.findOne(
		{
			publicId: homeworkPublicId,
		},
		{
			'solutions.publicId': solutionPublicId,
		}
	).then((result) => {
		if (result.solutions[0].isChecked) {
			throw Error('Solution already checked');
		}
	});
	await HomeworkModel.findOneAndUpdate(
		{
			publicId: homeworkPublicId,
			'solutions.publicId': solutionPublicId,
		},
		{
			$set: {
				'solutions.$.checkedById': teacherInfo._id,
				'solutions.$.isChecked': true,
				'solutions.$.totalPoints': 0,
			},
		}
	)
		.select('solutions')
		.then(async (result) => {
			if (!result) {
				throw Error("Can't find homework");
			}
			const solution = result.solutions[0];
			if (!solution) {
				throw Error("Can't find solution");
			}
			await HomeworkModel.findOneAndUpdate(
				{
					publicId: homeworkPublicId,
					receivedStudents: {
						$elemMatch: {
							studentId: solution.studentId,
						},
					},
				},
				{
					$set: {
						'receivedStudents.$.isChecked': true,
					},
				}
			);

			await Promise.all(
				Object.entries(values).map(async ([taskPublicId, value]) => {
					await HomeworkModel.updateOne(
						{
							publicId: homeworkPublicId,
						},
						{
							$set: {
								'solutions.$[i].answers.$[j].comment':
									value.comment,
								'solutions.$[i].answers.$[j].points':
									value.points,
							},
							$inc: {
								'solutions.$[i].totalPoints': parseInt(
									value.points
								),
							},
						},
						{
							arrayFilters: [
								{ 'i.publicId': solutionPublicId },
								{ 'j.taskPublicId': taskPublicId },
							],
						}
					);
				})
			);
			const studentId = solution.studentId;
			await StudentModel.updateOne(
				{
					_id: studentId,
					'homeworks.homeworkId': result._id,
				},
				{
					$set: {
						'homeworks.$.isChecked': true,
						'homeworks.$.solutionPublicId': solutionPublicId,
					},
				}
			);
		});
	return true;
};

HomeworkService.addSolutionByStudent = async function (
	homeworkPublicId,
	studentAnswers,
	studentPublicId
) {
	const checkStringAnswer = (answer, rightAnswer, points) => {
		if (
			answer.toLowerCase().replace(/ /g, '') ===
			rightAnswer.toLowerCase().replace(/ /g, '')
		) {
			return points;
		}
		return 0;
	};
	const checkOptionsAnswer = (answers, rightAnswers, points) => {
		var mistakes = 0;
		answers.map((option, index) => {
			option = option || false;
			if (option !== rightAnswers[index].isCorrect) {
				mistakes++;
			}
		});
		if (mistakes) return 0;
		return points;
	};

	const studentInfo = await StudentService.getStudentInfo({
		studentPublicId,
	});
	const solutionPublicId = nanoid();
	var solutionDocument = {
		publicId: solutionPublicId,
		studentId: studentInfo._id,
	};

	await HomeworkModel.findOne({ publicId: homeworkPublicId })
		.select('tasks')
		.then(async (result) => {
			const { tasks } = result;

			if (!tasks.length) {
				throw Error(
					'You cant add solution to the homework without tasks'
				);
			}
			if (tasks.length != studentAnswers.length) {
				throw Error('Count of answers does not match count of tasks');
			}

			await StudentModel.findOne(
				{
					_id: studentInfo._id,
				},
				{
					homeworks: {
						$elemMatch: {
							homeworkId: result._id,
						},
					},
				}
			).then((document) => {
				if (document.homeworks[0].hasSolution) {
					throw Error('You already have solution!');
				}
			});

			var totalPoints = 0;
			solutionDocument.answers = [];

			tasks.map((task) => {
				let pointsForAnswer = 0;

				const studentAnswer = studentAnswers.filter(
					(obj) => obj.taskPublicId === task.publicId
				)[0];
				switch (task.taskType) {
					case this.typesOfAnswers.OPTIONS_ANSWER:
						task.optionAnswers = task.optionAnswers.map(
							(option) => {
								return option || false;
							}
						);
						studentAnswer.answer = studentAnswer.answer.map(
							(option) => {
								return option || false;
							}
						);
						pointsForAnswer = checkOptionsAnswer(
							studentAnswer.answer,
							task.optionAnswers,
							task.maxPoints
						);
						break;
					case this.typesOfAnswers.STRING_ANSWER:
						pointsForAnswer = checkStringAnswer(
							studentAnswer.answer,
							task.stringAnswer,
							task.maxPoints
						);
						break;
				}
				solutionDocument.answers.push({
					detailedAnswer:
						task.taskType == this.typesOfAnswers.DETAILED_ANSWER
							? studentAnswer.answer
							: null,
					stringAnswer:
						task.taskType == this.typesOfAnswers.STRING_ANSWER
							? studentAnswer.answer
							: null,
					optionAnswers:
						task.taskType == this.typesOfAnswers.OPTIONS_ANSWER
							? studentAnswer.answer
							: null,
					points: pointsForAnswer,
					publicId: nanoid(),
					taskPublicId: task.publicId,
				});
				totalPoints += pointsForAnswer;
			});
			solutionDocument.totalPoints = totalPoints;
			await HomeworkModel.findOneAndUpdate(
				{
					_id: result._id,
					receivedStudents: {
						$elemMatch: {
							studentId: studentInfo._id,
						},
					},
				},
				{
					$push: { solutions: solutionDocument },
					$set: {
						'receivedStudents.$.hasSolution': true,
						'receivedStudents.$.solutionPublicId': solutionPublicId,
					},
				}
			).then((result) => {
				if (!result) {
					throw Error('Homework not found');
				}
			});
			await StudentModel.findOneAndUpdate(
				{
					_id: studentInfo._id,
					homeworks: {
						$elemMatch: {
							homeworkId: result._id,
						},
					},
				},
				{
					$set: {
						'homeworks.$.hasSolution': true,
					},
				}
			).then((result) => {
				if (!result) {
					throw Error('User not found');
				}
			});
		});
	return true;
};

HomeworkService.getSolutionByStudent = async function (
	homeworkPublicId,
	solutionPublicId
) {
	const solutionDocument = await HomeworkModel.findOne(
		{
			publicId: homeworkPublicId,
		},
		{ solutions: { $elemMatch: { publicId: solutionPublicId } } }
	)
		.select(
			'-_id tasks homeworkMaxPoints attachments creatorId subject description title attachments'
		)
		.exec()
		.then(async (result) => {
			result = result.toObject();
			if (!result) {
				throw Error("Can't find homework");
			}
			var solution = result.solutions[0];
			if (!solution) {
				throw Error("Can't find solution");
			}
			const creatorInfo = await TeacherService.getTeacherInfo({
				teacherId: result.creatorId,
				includeId: false,
				includeAvatarRef: true,
			});

			const checkedByInfo = await TeacherService.getTeacherInfo({
				teacherId: solution.checkedById,
				includeId: false,
				includeAvatarRef: true,
			});
			solution = {
				...solution,
				_id: undefined,
				studentId: undefined,
				checkedById: undefined,
			};
			delete result.solutions;
			solution.answers = solution.answers.map((answer) => {
				delete answer._id;
				return answer;
			});
			result.tasks = result.tasks.map((task) => {
				if (task.options) {
					task.options = task.options.map((option) => {
						delete option._id;
						return option;
					});
				}
				delete task._id;
				return task;
			});
			const attachments = await Promise.all(
				result.attachments.map(async (attachment) => {
					return await FilesService.getFileInfo(attachment);
				})
			);
			return {
				homework: {
					title: result.title,
					subject: result.subject,
					creatorInfo,
					description: result.description,
					attachments,
					tasks: result.tasks,
					homeworkMaxPoints: result.homeworkMaxPoints,
				},
				solution: {
					...solution,
					checkedByInfo,
				},
			};
		});
	if (!solutionDocument) {
		throw Error("Can't find solution");
	}
	return solutionDocument;
};

HomeworkService.getSolutionByTeacher = async function (
	homeworkPublicId,
	solutionPublicId
) {
	const solutionDocument = await HomeworkModel.findOne(
		{
			publicId: homeworkPublicId,
		},
		{ solutions: { $elemMatch: { publicId: solutionPublicId } } }
	)
		.select(
			'-_id tasks homeworkMaxPoints attachments creatorName creatorPublicId subject description title'
		)
		.exec()
		.then(async (result) => {
			result = result.toObject();
			var solution = result.solutions[0];
			const teacherInfo = solution.checkedById
				? await TeacherService.getTeacherInfo({
						includeId: false,
						teacherId: solution.checkedById,
						includeAvatarRef: true,
				  })
				: null;
			if (!result || !solution) {
				throw Error('Homework / solution not found');
			}
			delete solution._id;
			delete result.solutions;
			solution.answers = solution.answers.map((answer) => {
				delete answer._id;
				return answer;
			});
			result.tasks = result.tasks.map((task) => {
				if (task.options) {
					task.options = task.options.map((option) => {
						delete option._id;
						return option;
					});
				}
				delete task._id;
				return task;
			});
			const attachments = await Promise.all(
				result.attachments.map(async (attachment) => {
					return await FilesService.getFileInfo(attachment);
				})
			);
			solution.checkedById = undefined;
			solution.studentId = undefined;
			result = {
				...result,
				...solution,
				checkedByInfo: teacherInfo ? { ...teacherInfo } : undefined,
			};
			return { ...result, attachments };
		});
	if (!solutionDocument) {
		throw Error("Can't find solution");
	}
	return solutionDocument;
};

HomeworkService.getReceivedStudents = async (homeworkPublicId, offset) => {
	return await HomeworkModel.findOne(
		{ publicId: homeworkPublicId },
		{
			receivedStudents: {
				$slice: [offset, offset + STUDENTS_PER_REQUEST],
			},
		}
	).then(async (homework) => {
		if (!homework) {
			throw Error('Homework not found');
		}
		var { receivedStudents } = homework.toObject();
		return await Promise.all(
			receivedStudents.map(async ({ _id, ...student }) => {
				const studentInfo = await StudentService.getStudentInfo({
					includeId: false,
					studentId: student.studentId,
					includeAge: false,
				});
				return {
					...studentInfo,
					...student,
					studentId: undefined,
					name: undefined,
				};
			})
		);
	});
};

HomeworkService.addTeacherToHomework = async (
	homeworkPublicId,
	teacherPublicId,
	userPublicId
) => {
	if (userPublicId == teacherPublicId) {
		throw Error("You can't send homework to yourself");
	}

	const teacherInfo = await TeacherService.getTeacherInfo({
		teacherPublicId,
		includeId: true,
		includeAvatarRef: false,
	});

	await HomeworkModel.findOne(
		{ publicId: homeworkPublicId },
		{
			teachersWithAccess: {
				$elemMatch: teacherInfo._id,
			},
		}
	)
		.select('creatorPublicId teachersWithAccess')
		.then((result) => {
			if (!result) {
				throw Error('Homework not found');
			}
			if (result.creatorPublicId != userPublicId) {
				throw Error("You don't have permission to send this homework");
			}
			if (result.teachersWithAccess.length) {
				throw Error('This teacher already has this homework');
			}
		});
	await TeacherModel.findById(teacherInfo._id, 'hasAccess').then((result) => {
		if (!result.hasAccess) {
			throw Error("This teacher hasn't access");
		}
	});
	const homeworkId = await HomeworkModel.findOneAndUpdate(
		{ publicId: homeworkPublicId },
		{
			$push: {
				teachersWithAccess: teacherInfo._id,
			},
		}
	).then((result) => {
		return result._id;
	});
	await TeacherModel.findByIdAndUpdate(teacherInfo._id, {
		$push: { homeworks: homeworkId },
	});
};

HomeworkService.getTeachersWithAccess = async (homeworkPublicId, offset) => {
	return await HomeworkModel.findOne(
		{ publicId: homeworkPublicId },
		{
			teachersWithAccess: {
				$slice: [offset, offset + STUDENTS_PER_REQUEST],
			},
		}
	)
		.select('-_id creatorId teachersWithAccess')
		.then(async (result) => {
			if (!result) {
				throw Error('Homework not found');
			}
			const teachers = result.teachersWithAccess;
			teachers.push(result.creatorId);
			return await Promise.all(
				teachers.map(async (teacherId) => {
					const teacherInfo = await TeacherService.getTeacherInfo({
						includeId: false,
						includeAvatarRef: false,
						teacherId,
					});
					return {
						...teacherInfo,
						status:
							teacherId == result.creatorId
								? 'Creator'
								: 'Revisor',
					};
				})
			);
		});
};

HomeworkService.getHomeworkInfo = async (homeworkId) => {
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

const StudentService = require('./StudentService');
