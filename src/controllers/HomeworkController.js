const HomeworkService = require('../services/HomeworkService');
const HomeworkController = {};

HomeworkController.getListOfHomeworks = async (req, res, next) => {
	try {
		const userPublicId = req.user.publicId;
		const offset = Number.parseInt(req.query.offset);
		if (req.user.isTeacher) {
			var previews = await HomeworkService.getPreviewsByTeacher(
				userPublicId,
				offset
			);
		} else {
			var previews = await HomeworkService.getPreviewsByStudent(
				userPublicId,
				offset
			);
		}
		return res.status(200).json(previews);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

HomeworkController.getHomework = async (req, res, next) => {
	try {
		const homeworkPublicId = req.params.homeworkPublicId;
		if (req.user.isTeacher) {
			const homework = await HomeworkService.getByTeacher(
				homeworkPublicId
			);
			return res.status(200).json(homework);
		} else {
			const homework = await HomeworkService.getByStudent(
				homeworkPublicId,
				req.user.publicId
			);
			return res.status(200).json(homework);
		}
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

HomeworkController.addTask = async function (req, res, next) {
	try {
		/**
		 * POST
		 * {homeworkPublicId, type, text, options[], stringAnswer, detailedAnswer, taskAttachments[]}
		 */
		const {
			homeworkPublicId,
			taskType,
			condition,
			options,
			answer,
			maxPoints,
		} = req.body;
		const taskDocument = {
			taskType,
			text: condition,
			options,
			answer,
			points: maxPoints,
		};
		var taskAttachments = [];
		if (req.files !== undefined) {
			taskAttachments = req.files.taskAttachments;
		}
		await HomeworkService.addTask(
			homeworkPublicId,
			taskDocument,
			taskAttachments
		);

		return res.status(200).send();
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

HomeworkController.removeTask = async function (req, res, next) {
	try {
		/**
		 * POST
		 * {homeworkPublicId, taskPublicId}
		 */
		const homeworkPublicId = req.body.homeworkPublicId;
		const taskPublicId = req.body.taskPublicId;
		await HomeworkService.removeTask(homeworkPublicId, taskPublicId);
		return res.status(200).send();
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};
HomeworkController.createHomework = async function (req, res, next) {
	try {
		/**
		 * POST
		 * {homeworkTitle, homeworkDescription, homeworkSubject, homeworkAttachments[]}
		 */
		const creatorPublicId = req.user.publicId;
		const homeworkAttachments = req.files ? Object.values(req.files) : [];
		const homeworkTitle = req.body.homeworkTitle;
		const homeworkDescription = req.body.homeworkDescription;
		const homeworkSubject = req.body.homeworkSubject;

		const homeworkPublicId = await HomeworkService.createHomework(
			homeworkTitle,
			homeworkDescription,
			homeworkSubject,
			creatorPublicId,
			homeworkAttachments
		);
		return res.status(200).json({ homeworkPublicId });
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

HomeworkController.removeHomework = async function (req, res, next) {
	try {
		/**
		 * POST
		 * {homeworkPublicId}
		 */
		const homeworkPublicId = req.body.homeworkPublicId;
		await HomeworkService.removeHomework(homeworkPublicId);
		return res.status(200).send();
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

HomeworkController.sendHomework = async function (req, res, next) {
	try {
		/**
		 * {teacherPublicId, homeworkPublicId, studentPublicId}
		 */
		const studentPublicId = req.body.studentPublicId;
		const homeworkPublicId = req.body.homeworkPublicId;
		const deadline = req.body.deadline;
		await HomeworkService.sendHomework(
			studentPublicId,
			homeworkPublicId,
			deadline
		);
		return res.status(200).send();
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

HomeworkController.removeStudent = async function (req, res, next) {
	try {
		/**
		 * {teacherPublicId, homeworkPublicId, studentPublicId}
		 */
		const studentPublicId = req.body.studentPublicId;
		const homeworkPublicId = req.body.homeworkPublicId;
		await HomeworkService.removeStudent(studentPublicId, homeworkPublicId);
		return res.status(200).send();
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

HomeworkController.addGroup = async function (req, res, next) {
	try {
		/**
		 * {teacherPublicId, homeworkPublicId, groupPublicId}
		 */
		const teacherPublicId = req.user.publicId;
		const groupPublicId = req.body.groupPublicId;
		const homeworkPublicId = req.body.homeworkPublicId;
		HomeworkService.addGroup(groupPublicId, homeworkPublicId);
		return res.status(200).send();
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

HomeworkController.removeGroup = async function (req, res, next) {
	try {
		/**
		 * {homeworkPublicId, groupPublicId}
		 */
		const groupPublicId = req.body.groupPublicId;
		const homeworkPublicId = req.body.homeworkPublicId;
		HomeworkService.removeGroup(groupPublicId, homeworkPublicId);
		return res.status(200).send();
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

HomeworkController.sendAnswers = async function (req, res, next) {
	try {
		/**
		 * {studentPublicId, studentId, studentName, homeworkPublicId, formValues}
		 */
		const studentPublicId = req.user.publicId;
		const answers = req.body.answers;
		const homeworkPublicId = req.body.homeworkPublicId;
		await HomeworkService.addSolutionByStudent(
			homeworkPublicId,
			answers,
			studentPublicId
		);
		return res.status(200).send();
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

HomeworkController.getSolution = async function (req, res, next) {
	try {
		/**
		 * GET
		 * {homeworkPublicId, solutionPublicId}
		 */
		const { homeworkPublicId, solutionPublicId } = req.params;
		var solutionDocument;
		if (req.user.isTeacher) {
			solutionDocument = await HomeworkService.getSolutionByTeacher(
				homeworkPublicId,
				solutionPublicId
			);
		} else {
			solutionDocument = await HomeworkService.getSolutionByStudent(
				homeworkPublicId,
				solutionPublicId
			);
		}
		return res.status(200).json(solutionDocument);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

HomeworkController.checkSolution = async function (req, res, next) {
	try {
		const { homeworkPublicId, solutionPublicId, comments } = req.body;

		await HomeworkService.checkSolution(
			homeworkPublicId,
			solutionPublicId,
			comments,
			req.user.publicId
		);
		return res.status(200).send();
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

HomeworkController.getReceivedStudents = async function (req, res, next) {
	try {
		const { homeworkPublicId, offset } = req.query;
		const receivedStudents = await HomeworkService.getReceivedStudents(
			homeworkPublicId,
			parseInt(offset)
		);
		return res.status(200).json(receivedStudents);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

HomeworkController.sendHomeworkToTeacher = async (req, res, next) => {
	try {
		const { homeworkPublicId, teacherPublicId } = req.body;
		await HomeworkService.addTeacherToHomework(
			homeworkPublicId,
			teacherPublicId,
			req.user.publicId
		);
		return res.status(200).send();
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

HomeworkController.getTeachersWithAccess = async (req, res, next) => {
	try {
		const { homeworkPublicId, offset } = req.query;
		const teachers = await HomeworkService.getTeachersWithAccess(
			homeworkPublicId,
			offset
		);
		return res.status(200).json(teachers);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

module.exports = HomeworkController;
