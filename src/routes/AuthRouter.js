const express = require('express');
const AuthRouter = express.Router();
const AuthController = require('../controllers/AuthController');
const { body, check, validationResult } = require('express-validator');
const UserController = require('../controllers/UserController');

const validationRules = (req, res, next) => {
	body('email')
		.isEmail()
		.isLength({ min: 10, max: 30 })
		.withMessage('Email length should be 10 to 30 characters');
	body('username', 'Username length should be 8 to 20 characters').isLength({
		min: 8,
		max: 20,
	});
	body('password')
		.isLength({
			min: 8,
			max: 16,
		})
		.withMessage('Password length should be 8 to 16 characters')
		.matches(/(?=.*\d)/)
		.withMessage('Password should contain numbers')
		.matches(/([a-zA-z0-9_-]*)/)
		.withMessage('Password should contain only letters, numbers, - and _');
	body('name')
		.isLength({
			min: 6,
			max: 30,
		})
		.withMessage('Name length should be 6 to 30 characters')
		.isAlpha()
		.withMessage('Name must be alphabetic');
	check('homeworkPublicId')
		.isLength(21)
		.withMessage('PublicId should be 21 character long')
		.matches(/([a-zA-z0-9_-]*)/)
		.withMessage('PublicId should contain only letters, numbers, - and _');
	check('taskPublicId')
		.isLength(21)
		.withMessage('PublicId should be 21 character long')
		.matches(/([a-zA-z0-9_-]*)/)
		.withMessage('PublicId should contain only letters, numbers, - and _');
	check('startHomeworkId', 'startHomeworkId should be number > 0').isInt({
		min: 0,
	});
	var errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(400).json({ status: 400, message: errors.array() }).send();
		return 0;
	}
	next();
	return 1;
};

//open routes
AuthRouter.post('/studentLogin', validationRules, AuthController.student.login);
AuthRouter.post(
	'/studentRegistration',
	validationRules,
	AuthController.student.register
);

AuthRouter.post('/teacherLogin', validationRules, AuthController.teacher.login);
AuthRouter.post(
	'/teacherRegistration',
	validationRules,
	AuthController.teacher.register
);

AuthRouter.get('/logout', AuthController.logout);

AuthRouter.post(
	'/changePassword',
	AuthController.isStudent,
	UserController.changePassword
);

module.exports = AuthRouter;