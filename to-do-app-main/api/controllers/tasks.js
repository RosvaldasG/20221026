const TaskSchema = require("../models/taskModel");
const UserSchema = require("../models/userModel");

module.exports.GET_TASKS = function (req, res) {
  TaskSchema.find().then((results) => {
    return res.status(200).json({ tasks: results });
  });
};

module.exports.GET_TASK = function (req, res) {
  TaskSchema.findOne({ _id: req.params.id }).then((results) => {
    return res.status(200).json({ tasks: results });
  });
};

module.exports.INSERT_TASK = function (req, res) {
  const task = new TaskSchema({
    task: req.body.task,
    isDone: req.body.isDone,
  });

  task.save().then((result) => {
    console.log(result._id.toString());

    TaskSchema.updateOne({ _id: result._id }, { id: result._id }).exec();

    UserSchema.updateOne(
      { _id: req.body.userId },
      { $push: { taskIds: result._id.toString() } }
    ).exec();

    return res.status(200).json({
      statusMessage: "task was inserted successfully",
      result: result,
    });
  });
};

module.exports.EDIT_TASK = (req, res) => {
  TaskSchema.updateOne(
    { _id: req.params.id },
    { task: req.body.editedTask }
  ).then((result) => {
    res
      .status(200)
      .json({ statusMessage: "Eddited successfully", editedTask: result });
  });
};

module.exports.CHANGE_TASK_STATUS = async (req, res) => {
  const currentTaskData = await TaskSchema.findOne({
    _id: req.params.id,
  }).exec();

  // console.log("currentTask", currentTaskData.isDone);

  TaskSchema.updateOne(
    { _id: req.params.id },
    { isDone: !currentTaskData.isDone }
  ).then((result) => {
    res
      .status(200)
      .json({ statusMessage: "Eddited successfully", editedTask: result });
  });
};

module.exports.DELETE_TASK = async function (req, res) {
  const resultFromDb = await TaskSchema.deleteOne({
    _id: req.params.id,
  }).exec();

  return res.status(200).json({
    statusMessage: "Item was deleted sucessfuly",
    deletedItem: resultFromDb,
  });
};
