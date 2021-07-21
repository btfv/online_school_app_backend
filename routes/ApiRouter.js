const express = require('express');
const ApiRouter = express.Router();
const AuthController = require('../controllers/AuthController');
const HomeworkController = require('../controllers/HomeworkController');
const StudentController = require('../controllers/StudentController');
const FilesController = require('../controllers/FilesController');
const UserController = require('../controllers/UserController');
const teacherController = require('../controllers/TeacherController');

//protected routes

ApiRouter.get(
	'/getListOfHomeworks',
	AuthController.isStudent,
	HomeworkController.getListOfHomeworks
);
ApiRouter.get(
	'/getHomework/:homeworkPublicId',
	AuthController.isStudent,
	HomeworkController.getHomework
);

ApiRouter.post(
	'/createHomework',
	AuthController.isTeacher,
	HomeworkController.createHomework
);

ApiRouter.post(
	'/removeHomework',
	AuthController.isTeacher,
	HomeworkController.removeHomework
);

ApiRouter.post(
	'/addTask',
	AuthController.isTeacher,
	HomeworkController.addTask
);
ApiRouter.post(
	'/removeTask',
	AuthController.isTeacher,
	HomeworkController.removeTask
);
ApiRouter.post(
	'/sendHomework',
	AuthController.isTeacher,
	HomeworkController.sendHomework
);
ApiRouter.post(
	'/homeworks/removeGroup',
	AuthController.isTeacher,
	HomeworkController.removeGroup
);
ApiRouter.post(
	'/addGroup',
	AuthController.isTeacher,
	HomeworkController.addGroup
);
ApiRouter.post(
	'/removeStudent',
	AuthController.isTeacher,
	HomeworkController.removeStudent
);
ApiRouter.post(
	'/sendAnswers',
	AuthController.isStudent,
	HomeworkController.sendAnswers
);
ApiRouter.get(
	'/getSolution/:homeworkPublicId.:solutionPublicId',
	AuthController.isStudent,
	HomeworkController.getSolution
);
ApiRouter.get(
	'/getStudentList',
	AuthController.isTeacher,
	StudentController.getStudentsByName
);
ApiRouter.get(
	'/getUserInfo/:publicId',
	AuthController.isTeacher,
	UserController.getInfo
);
ApiRouter.get(
	'/getReceivedStudents',
	AuthController.isTeacher,
	HomeworkController.getReceivedStudents
);
ApiRouter.get('/upload_files/:fileReference', FilesController.getFile);
ApiRouter.get('/get_avatar/:filePath', FilesController.getAvatar);
ApiRouter.post(
	'/checkSolution',
	AuthController.isTeacher,
	HomeworkController.checkSolution
);
ApiRouter.post(
	'/uploadProfilePic',
	AuthController.isTeacher,
	UserController.setUserPicture
);
ApiRouter.get(
	'/getProfile',
	AuthController.isStudent,
	UserController.getProfile
);
ApiRouter.post(
	'/sendHomeworkToTeacher',
	AuthController.isTeacher,
	HomeworkController.sendHomeworkToTeacher
);
ApiRouter.get(
	'/getTeachersWithAccess',
	AuthController.isTeacher,
	HomeworkController.getTeachersWithAccess
);
ApiRouter.get(
	'/getTeacherList',
	AuthController.isTeacher,
	teacherController.getTeachersByName
);
module.exports = ApiRouter;
