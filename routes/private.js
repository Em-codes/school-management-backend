const express = require("express");
const router = express.Router();
const { registerCourse, updateScore, getAllUserForACourse  } = require("../controllers/course-controller");
const { uploadFile, getProfileImage } = require("../controllers/fileupload-controller");
const { getUser, getStudent, getAllStudents, getTeacher, getAllTeachers, updateProfile, deleteUser, } = require('../controllers/private');
const { protect, isAdmin, isTeacherAndAdmin } = require('../middlewares/authProtect');
const { upload } = require("../utils/filehelper")



// user routes
router.route('/user').get(protect, getUser);
router.route('/profile').post(protect, updateProfile);


// file uploads
router.post('/upload-photo', upload.single('file'), (uploadFile))
router.route('/profile-photo').get(getProfileImage)


router.route('/register-course/:id').post(protect, registerCourse) //userId
router.route('/update-score/:id').put(protect, isTeacherAndAdmin, updateScore) //courseId
router.route('/students').get(protect, isTeacherAndAdmin, getAllStudents);
router.route('/getcourse').get(getAllUserForACourse)

// admin routes
router.route('/admin').get(protect, isAdmin, getUser);
router.route('/admin/user/:id').get(protect, isAdmin, getStudent);
router.route('/admin/teacher/:id').get(protect, isAdmin, getTeacher);
router.route('/admin/teachers').get(protect, isAdmin, getAllTeachers);
router.route('/admin/delete-user/:id').delete(protect, isAdmin, deleteUser);

module.exports = router;