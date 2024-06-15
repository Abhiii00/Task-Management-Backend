const userModel = require("../models/userModel.js");
const taskModel = require("../models/taskModel.js");
let { message, response } = require('../utils/response.js')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require('../config/config.js')

exports.userRegistration = async (req, res) => {
  try {
    let userData = req.body;

    let existingUser = await userModel.findOne({ email: userData.email });
    if (existingUser) {
      return res
        .status(400)
        .send(response(false, 'Email already registered'));
    }


    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(userData.password, salt);
    userData.password = hashpass;

    let newUser = await userModel.create(userData);

    let token = jwt.sign(
      { userId: newUser._id.toString() },
      config.JWT_SECRET_KEY,
      { expiresIn: config.SESSION_EXPIRES_IN }
    );

    let userResponseData = {
      token,
      email: newUser.email,
      _id: newUser._id,
      userType: newUser.userType,
    };
    res
      .status(201)
      .send(response(true, 'Success', userResponseData));
    } catch (error) {
    return res.status(500).send(response(false, message.catchMessage));
  }
};

exports.loginUser = async (req, res) => {
  try {
    const data = req.body;
    const { email, password } = data;

    let user = await userModel.findOne({ email: email });
    if (!user)
      return res
        .status(200)
        .send(response(false, 'Invalid credentail'));

    let passCheck = await bcrypt.compare(password, user.password);
    if (!passCheck)
      return res.status(200).send(response(false, 'Wrong password'));    ;

    let token = jwt.sign(
      { userId: user._id.toString() },
      "task-managmeny-xdfd",
      { expiresIn: "12h" }
    );

    let userData = {
      token,
      email: user.email,
      _id: user._id,
      userType: user.userType,
    };

    return res.status(200).send(response(true, 'Success', userData));    ;
  } catch (error) {
    return res.status(500).send(response(false, message.catchMessage));
  }
};

exports.getUserList = async (req, res) => {
  try {
    let user = await userModel.find({ userType: "User", isDeleted: false });
    if (user) {
      res.status(200).send(response(true, 'Success', user));
    } else {
      res.status(200).send(response(false, message.noDataMessage));
    }
  } catch (error) {
    return res.status(500).send(response(false, message.catchMessage));
  }
};

exports.getAdminCounts = async (req, res) => {
  try {
    const [userCount, totalTaskAssigned, pendingTaskCount, completedTaskCount] =
      await Promise.all([
        userModel.countDocuments(),
        taskModel.countDocuments(),
        taskModel.countDocuments({ status: "pending", isDeleted: false }),
        taskModel.countDocuments({ status: "completed", isDeleted: false }),
      ]);

    res.status(200).send({
      success: true,
      msg: "Counts fetched successfully",
      data: {
        totalUsers: userCount,
        totalTasks: totalTaskAssigned,
        pendingTasks: pendingTaskCount,
        completedTasks: completedTaskCount,
      },
    });
  } catch (error) {
    return res.status(500).send(response(false, message.catchMessage));
  }
};

exports.getUserCounts = async (req, res) => {
  try {
    const userId = req.userId;

    const [totalTaskReceived, pendingTaskCount, completedTaskCount] =
      await Promise.all([
        taskModel.countDocuments({ userId: userId, isDeleted: false }),
        taskModel.countDocuments({
          userId: userId,
          isDeleted: false,
          status: "pending",
        }),
        taskModel.countDocuments({
          userId: userId,
          isDeleted: false,
          status: "completed",
        }),
      ]);

    res.status(200).send({
      success: true,
      msg: "Counts fetched successfully",
      data: {
        totalTaskReceived: totalTaskReceived,
        pendingTasks: pendingTaskCount,
        completedTasks: completedTaskCount,
      },
    });
  } catch (error) {
    return res.status(500).send(response(false, message.catchMessage));
  }
};
