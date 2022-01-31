const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');


exports.getUser = (req, res, next) => {
    const { id } = req.user
    try {
        User.findOne({ _id: id }, function (err, user) {
            res.json(user);
        });

    } catch (error) {
        next(error)
    }


};

exports.getStudent = (req, res, next) => {
    const { id } = req.params

    User.find({ _id: id, role: "user" }, function (err, user) {
        if (err) {
            return next(new ErrorResponse("Invalid student or ID  not found", 404));
        }
        res.json(user);
    })

};

exports.getAllStudents = (req, res, next) => {

    try {
        User.find({ role: 'user' }, function (err, users) {
            if (err) {
                return res.json({ success: false, data: "something went wrong" })
            }
            res.json(users)
        })

    } catch (error) {
        next(error)
    }
};

exports.getTeacher = (req, res) => {

    const { id } = req.params

    User.findById({ _id: id, role: "teacher" }, function (err, user) {
        if (err) {
            return next(new ErrorResponse("Invalid teacher or ID  not found", 404));
        }
        res.json(user);
    })

};

exports.getAllTeachers = (req, res, next) => {
    try {
        User.find({ role: 'teacher' }, function (err, teachers) {
            if (err) {
                return res.json({ success: false, data: "something went wrong" })
            }
            res.json(teachers)
        })
    } catch (error) {
        next(error)
    }
};



exports.updateProfile = async (req, res, next) => {
    
    // try {
    //     const { username } = req.body;
    //     const { id } = req.params;
    //     const filter = { id : id }
      
    //     const updatedUser = await User.findOneAndUpdate(filter, req.body, { new: true })

    //     return res.status(200).json({
    //         message : "Updated user",
    //         data: updatedUser
    //       });

    // } catch (error) {
    //     next(error)
    // }

    const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.pic = req.body.pic || user.pic;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      pic: updatedUser.pic,
    //   isAdmin: updatedUser.isAdmin,
    //   token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
        

};

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({ success:true, token})
}