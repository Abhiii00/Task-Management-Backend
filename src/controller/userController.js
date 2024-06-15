const userModel = require("../models/userModel.js");
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
    
    let page = Number(req.query.page) || 1     
    let limit = Number(req.query.limit) || 10
    let user = await userModel.find({ userType: "User", isDeleted: false }).skip((page - 1)*limit).limit(limit);
    if (user) {
      res.status(200).send(response(true, 'Success', user));
    } else {
      res.status(200).send(response(false, message.noDataMessage));
    }
  } catch (error) {
    return res.status(500).send(response(false, message.catchMessage));
  }
};


