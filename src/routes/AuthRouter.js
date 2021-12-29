const express = require('express');
const AuthRouter = express.Router();
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');
const JoiValidator = require('../middlewares/joi_validator.middleware');
const AuthLoginSchema = require('../joi_schemas/objects/auth.login.schema');
const AuthSignupSchema = require('../joi_schemas/objects/auth.signup.schema');
const ChangePasswordSchema = require('../joi_schemas/objects/auth.changePassword.schema');

//open routes
AuthRouter.post(
  '/studentLogin',
  JoiValidator(AuthLoginSchema),
  AuthController.student.login
);
AuthRouter.post(
  '/studentRegistration',
  JoiValidator(AuthSignupSchema),
  AuthController.student.register
);

AuthRouter.post(
  '/teacherLogin',
  JoiValidator(AuthLoginSchema),
  AuthController.teacher.login
);
AuthRouter.post(
  '/teacherRegistration',
  JoiValidator(AuthSignupSchema),
  AuthController.teacher.register
);

AuthRouter.get('/logout', AuthController.logout);

AuthRouter.post(
  '/changePassword',
  JoiValidator(ChangePasswordSchema),
  UserController.changePassword
);

module.exports = AuthRouter;
