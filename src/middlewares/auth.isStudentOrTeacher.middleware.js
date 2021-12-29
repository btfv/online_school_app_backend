const passport = require('passport');
const CheckCookie = require('../utils/checkCookie.util');

module.exports = async function IsStudentOrTeacher(req, res, next) {
  const cookie = req.cookies.Authorization;
  if (!CheckCookie(cookie)) {
    return res.status(401).send();
  }
  await passport.authenticate(
    'jwt',
    { session: false },
    async (error, user) => {
      try {
        if (!user) {
          return res.status(401).send();
        }
        if (error) {
          throw error;
        }
        if (user.isTeacher && !user.hasAccess) {
          throw Error('You have to wait for admin approval');
        }
        req.user = user;
        next();
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  )(req, res, next);
};
