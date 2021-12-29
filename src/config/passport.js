const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const bcrypt = require('bcrypt');
const secret = process.env.SECRET_KEY;

const StudentModel = require('../models/StudentModel');
const TeacherModel = require('../models/TeacherModel');

passport.use(
	'student-local',
	new LocalStrategy(
		{
			usernameField: 'username',
			passwordField: 'password',
		},
		async (username, password, done) => {
			try {
				const studentDocument = await StudentModel.findOne({
					username: username,
				})
					.select('_id publicId username name firstname lastname passwordHash')
					.exec();
				if (!studentDocument) {
					return done(Error('Incorrect Username / Password'), null);
				}
				const passwordsMatch = await bcrypt.compare(
					password,
					studentDocument.passwordHash
				);
				if (passwordsMatch) {
					return done(null, studentDocument);
				} else {
					return done(Error('Incorrect Username / Password'), null);
				}
			} catch (error) {
				return done(error, null);
			}
		}
	)
);
passport.use(
	'teacher-local',
	new LocalStrategy(
		{
			usernameField: 'username',
			passwordField: 'password',
		},
		async (username, password, done) => {
			try {
				const teacherDocument = await TeacherModel.findOne({
					username,
				})
					.select('_id publicId username firstname lastname passwordHash hasAccess')
					.exec();
				if (!teacherDocument) {
					return done(Error('Incorrect Username / Password'), null);
				}
				const passwordsMatch = await bcrypt.compare(
					password,
					teacherDocument.passwordHash
				);
				if (passwordsMatch) {
					return done(null, teacherDocument);
				} else {
					return done(Error('Incorrect Username / Password'), null);
				}
			} catch (error) {
				return done(error, null);
			}
		}
	)
);

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req) => {
					let jwt = req.cookies.Authorization.split(' ')[1];
					return jwt;
				},
			]),
			secretOrKey: secret,
		},
		async (token, done) => {
			try {
				done(null, token);
			} catch (error) {
				done(error, null);
			}
		}
	)
);