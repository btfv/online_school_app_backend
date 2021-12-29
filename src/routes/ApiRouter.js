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
  AuthController.checkForRedirect,
  HomeworkController.getListOfHomeworks
);
ApiRouter.get(
  '/getHomework/:homeworkPublicId',
  AuthController.isStudent,
  AuthController.checkForRedirect,
  HomeworkController.getHomework
);

ApiRouter.post(
  '/createHomework',
  AuthController.isTeacher,
  AuthController.checkForRedirect,
  HomeworkController.createHomework
);

ApiRouter.post(
  '/removeHomework',
  AuthController.isTeacher,
  AuthController.checkForRedirect,
  HomeworkController.removeHomework
);

ApiRouter.post(
  '/addTask',
  AuthController.isTeacher,
  AuthController.checkForRedirect,
  HomeworkController.addTask
);
ApiRouter.post(
  '/removeTask',
  AuthController.isTeacher,
  AuthController.checkForRedirect,
  HomeworkController.removeTask
);
ApiRouter.post(
  '/sendHomework',
  AuthController.isTeacher,
  AuthController.checkForRedirect,
  HomeworkController.sendHomework
);
ApiRouter.post(
  '/homeworks/removeGroup',
  AuthController.isTeacher,
  AuthController.checkForRedirect,
  HomeworkController.removeGroup
);
ApiRouter.post(
  '/addGroup',
  AuthController.isTeacher,
  AuthController.checkForRedirect,
  HomeworkController.addGroup
);
ApiRouter.post(
  '/removeStudent',
  AuthController.isTeacher,
  AuthController.checkForRedirect,
  HomeworkController.removeStudent
);
ApiRouter.post(
  '/sendAnswers',
  AuthController.isStudent,
  AuthController.checkForRedirect,
  HomeworkController.sendAnswers
);
ApiRouter.get(
  '/getSolution/:homeworkPublicId.:solutionPublicId',
  AuthController.isStudent,
  AuthController.checkForRedirect,
  HomeworkController.getSolution
);
ApiRouter.get(
  '/getStudentList',
  AuthController.isTeacher,
  AuthController.checkForRedirect,
  StudentController.getStudentsByName
);
ApiRouter.get(
  '/getUserInfo/:publicId',
  AuthController.isTeacher,
  AuthController.checkForRedirect,
  UserController.getInfo
);
ApiRouter.get(
  '/getReceivedStudents',
  AuthController.isTeacher,
  AuthController.checkForRedirect,
  HomeworkController.getReceivedStudents
);
ApiRouter.get('/upload_files/:fileReference', FilesController.getFile);
ApiRouter.get('/get_avatar/:filePath', FilesController.getAvatar);
ApiRouter.post(
  '/checkSolution',
  AuthController.isTeacher,
  AuthController.checkForRedirect,
  HomeworkController.checkSolution
);
ApiRouter.post(
  '/uploadProfilePic',
  AuthController.isTeacher,
  AuthController.checkForRedirect,
  UserController.setUserPicture
);
ApiRouter.get(
  '/getProfile',
  AuthController.isStudent,
  AuthController.checkForRedirect,
  UserController.getProfile
);
ApiRouter.post(
  '/sendHomeworkToTeacher',
  AuthController.isTeacher,
  AuthController.checkForRedirect,
  HomeworkController.sendHomeworkToTeacher
);
ApiRouter.get(
  '/getTeachersWithAccess',
  AuthController.isTeacher,
  AuthController.checkForRedirect,
  HomeworkController.getTeachersWithAccess
);
ApiRouter.get(
  '/getTeacherList',
  AuthController.isTeacher,
  AuthController.checkForRedirect,
  teacherController.getTeachersByName
);
module.exports = ApiRouter;
