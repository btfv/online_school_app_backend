const express = require('express');
const ApiRouter = express.Router();
const AuthController = require('../controllers/AuthController');
const HomeworkController = require('../controllers/HomeworkController');
const StudentController = require('../controllers/StudentController');
const FilesController = require('../controllers/FilesController');
const UserController = require('../controllers/UserController');
const teacherController = require('../controllers/TeacherController');
const IsTeacher = require('../middlewares/auth.isTeacher.middleware');
const IsStudentOrTeacher = require('../middlewares/auth.isStudentOrTeacher.middleware');
const WrongModeRedirect = require('../middlewares/auth.wrongModeRedirect.middleware');
//protected routes

ApiRouter.get(
  '/getListOfHomeworks',
  IsStudentOrTeacher,
  WrongModeRedirect,
  HomeworkController.getListOfHomeworks
);
ApiRouter.get(
  '/getHomework/:homeworkPublicId',
  IsStudentOrTeacher,
  WrongModeRedirect,
  HomeworkController.getHomework
);

ApiRouter.post(
  '/createHomework',
  IsTeacher,
  WrongModeRedirect,
  HomeworkController.createHomework
);

ApiRouter.post(
  '/removeHomework',
  IsTeacher,
  WrongModeRedirect,
  HomeworkController.removeHomework
);

ApiRouter.post(
  '/addTask',
  IsTeacher,
  WrongModeRedirect,
  HomeworkController.addTask
);
ApiRouter.post(
  '/removeTask',
  IsTeacher,
  WrongModeRedirect,
  HomeworkController.removeTask
);
ApiRouter.post(
  '/sendHomework',
  IsTeacher,
  WrongModeRedirect,
  HomeworkController.sendHomework
);
ApiRouter.post(
  '/homeworks/removeGroup',
  IsTeacher,
  WrongModeRedirect,
  HomeworkController.removeGroup
);
ApiRouter.post(
  '/addGroup',
  IsTeacher,
  WrongModeRedirect,
  HomeworkController.addGroup
);
ApiRouter.post(
  '/removeStudent',
  IsTeacher,
  WrongModeRedirect,
  HomeworkController.removeStudent
);
ApiRouter.post(
  '/sendAnswers',
  IsStudentOrTeacher,
  WrongModeRedirect,
  HomeworkController.sendAnswers
);
ApiRouter.get(
  '/getSolution/:homeworkPublicId.:solutionPublicId',
  IsStudentOrTeacher,
  WrongModeRedirect,
  HomeworkController.getSolution
);
ApiRouter.get(
  '/getStudentList',
  IsTeacher,
  WrongModeRedirect,
  StudentController.getStudentsByName
);
ApiRouter.get(
  '/getUserInfo/:publicId',
  IsTeacher,
  WrongModeRedirect,
  UserController.getInfo
);
ApiRouter.get(
  '/getReceivedStudents',
  IsTeacher,
  WrongModeRedirect,
  HomeworkController.getReceivedStudents
);
ApiRouter.get('/upload_files/:fileReference', FilesController.getFile);
ApiRouter.get('/get_avatar/:filePath', FilesController.getAvatar);
ApiRouter.post(
  '/checkSolution',
  IsTeacher,
  WrongModeRedirect,
  HomeworkController.checkSolution
);
ApiRouter.post(
  '/uploadProfilePic',
  IsTeacher,
  WrongModeRedirect,
  UserController.setUserPicture
);
ApiRouter.get(
  '/getProfile',
  IsStudentOrTeacher,
  WrongModeRedirect,
  UserController.getProfile
);
ApiRouter.post(
  '/sendHomeworkToTeacher',
  IsTeacher,
  WrongModeRedirect,
  HomeworkController.sendHomeworkToTeacher
);
ApiRouter.get(
  '/getTeachersWithAccess',
  IsTeacher,
  WrongModeRedirect,
  HomeworkController.getTeachersWithAccess
);
ApiRouter.get(
  '/getTeacherList',
  IsTeacher,
  WrongModeRedirect,
  teacherController.getTeachersByName
);
module.exports = ApiRouter;
