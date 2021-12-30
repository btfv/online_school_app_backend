const StudentService = require('../services/StudentService');
const StudentController = {};

StudentController.changePassword = async function (req, res, next) {
  try {
    const userId = req.user._id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    await StudentService.changePassword(userId, oldPassword, newPassword);
    return res.status(200).send();
  } catch (error) {
    return next(error);
  }
};

StudentController.getListOfStudents = async function (req, res, next) {
  try {
    const sliceNumber = req.query.sliceNumber;
    const students = await StudentService.getListOfStudents(sliceNumber);
    return res.status(200).json(students);
  } catch (error) {
    return next(error);
  }
};

StudentController.getStudentsByName = async function (req, res, next) {
  try {
    const name = req.query.name;
    const studentDocuments = await StudentService.getStudentsByName(name);
    return res.status(200).json(studentDocuments);
  } catch (error) {
    return next(error);
  }
};

module.exports = StudentController;
