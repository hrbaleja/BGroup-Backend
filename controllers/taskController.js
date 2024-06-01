const express = require('express');
const Task = require('../models/Task');



// Get all tasks associated with the user

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};


exports.getTasksByStatus = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.id, status: req.params.id });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};


exports.createTask = async (req, res, next) => {
  try {
    const { title, description,status } = req.body;
    const task = new Task({ title, description, status,userId: req.user.id, });
    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { title, description ,status} = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, description,status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    res.json({ msg: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};