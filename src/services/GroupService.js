const GroupModel = require('../models/GroupModel');
const StudentModel = require('../models/StudentModel');

const GroupService = {};

GroupService.addStudentToGroup = async function (studentId, groupId) {
	await GroupModel.findByIdAndUpdate(groupId, {
		$push: { students: studentId },
	});
	await StudentModel.findByIdAndUpdate(studentId, {
		$push: { groups: groupId },
	});
	return true;
};

GroupService.kickStudentFromGroup = async function (studentId, groupId) {
	await GroupModel.findByIdAndUpdate(groupId, {
		$pull: { students: { _id: studentId } },
	});
	await StudentModel.findByIdAndUpdate(studentId, {
		$push: { groups: { _id: groupId } },
	});
	return true;
};

module.exports = GroupService;
