module.exports = function WrongModeRedirect(req, res, next) {
  if (
    req.user.isTeacher &&
    req.headers['referer'].includes(process.env.STUDENT_FRONTEND_ADDRESS)
  ) {
    res.status(401).json({
      error: 'Wrong mode. Move to ' + process.env.TEACHER_FRONTEND_ADDRESS,
    });
    return;
  }
  if (
    !req.user.isTeacher &&
    req.headers['referer'].includes(process.env.TEACHER_FRONTEND_ADDRESS)
  ) {
    res.status(401).json({
      error: 'Wrong mode. Move to ' + process.env.STUDENT_FRONTEND_ADDRESS,
    });
    return;
  }
  next();
};
