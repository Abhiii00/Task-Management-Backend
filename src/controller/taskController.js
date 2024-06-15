const taskModel = require("../models/taskModel.js");
const {response, message} = require('../utils/response.js')


exports.createTask = async (req, res) => {
  try {
    let task = await taskModel.create({...req.body });
    if (task) {
      res.status(200).send(response(true, 'Success'));
    } else {
      res.status(400).send(response(false, 'Something went wrong, Please try again later'));
    }
  } catch (error) {
    return res.status(500).send(response(false, message.catchMessage));
  }
};


exports.getTaskList = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1     
    let limit = Number(req.query.limit) || 10
    let tasks = await taskModel.find({ isDeleted: false })
      .populate({
        path: 'userId',
        select: 'name', 
        model: 'User'   
      }).skip((page - 1)*limit).limit(limit);

    tasks = tasks.map(task => ({
      _id: task._id,
      title: task.title,
      description: task.description,
      date: task.date,
      priority: task.priority,
      status: task.status,
      userId: task.userId._id,
      name: task.userId.name, 
    }));

    if (tasks.length > 0) {
      res.status(200).send(response(true, 'Success', tasks));
    } else {
      res.status(200).send(response(false, message.noDataMessage));
    }
  } catch (error) {
    return res.status(500).send(response(false, message.catchMessage));
  }
};


exports.getTaskListByUserId = async (req, res) => {
  try {
    let task = await taskModel.find({ userId: req.userId, isDeleted: false });
    if (task) {
      res.status(200).send(response(true, 'Success', task));
    } else {
      res.status(200).send(response(false, message.noDataMessage));
    }
  } catch (error) {
    return res.status(500).send(response(false, message.catchMessage));
  }
};


exports.updateTask = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    let task = await taskModel.findByIdAndUpdate(id, updateData, { new: true });
    if (task) {
      res.status(200).send(response(true, 'Success'));
    } else {
      res.status(400).send(response(false, 'Something went wrong, Please try again later'));
    }
  } catch (error) {
    return res.status(500).send(response(false, message.catchMessage));
  }
};


exports.updateTaskStatus = async (req, res) => {
  try {
    let { id, status } = req.body;
    console.log(req.body)
    
    let task = await taskModel.findByIdAndUpdate(id, { $set: { status } }, { new: true });
    if (task) {
      res.status(200).send(response(true, 'Success'));
    } else {
      res.status(200).send(response(false, 'No result found'));
    }
  } catch (error) {
    return res.status(500).send(response(false, message.catchMessage));
  }
};


exports.deleteTask = async (req, res) => {
  try {
    let { id } = req.body
    let task = await taskModel.findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true });
    if (task) {
      res.status(200).send(response(true, 'Success'));
    } else {
      res.status(400).send(response(false, 'Something went wrong, Please try again later'));
    }
  } catch (error) {
    return res.status(500).send(response(false, message.catchMessage));
  }
};