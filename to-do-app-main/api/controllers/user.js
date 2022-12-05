const bcrypt = require("bcryptjs");
const { rawListeners } = require("../models/userModel");
const UserSchema = require("../models/userModel");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.CREATE_USER = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new UserSchema({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    taskIds: [],
    totalTasksDone: 0,
  });

  user
    .save()
    .then((result) => {
      console.log(result);
      return res
        .status(200)
        .json({ response: "User was created succses", user });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(500).json({ responce: "Failed" });
    });
};

module.exports.GET_USERS = function (req, res) {
  UserSchema.find().then((results) => {
    return res.status(200).json({ user: results });
  });
};

module.exports.GET_USER = async function (req, res) {
  const data = await UserSchema.aggregate([
    {
      $lookup: {
        from: "tasks",
        localField: "taskIds",
        foreignField: "id",
        as: "user_tasks",
      },
    },
    { $match: { _id: ObjectId(req.params.id) } },
  ]).exec();

  console.log(data);

  return res.status(200).json({ user: data });
};

module.exports.USER_LOGIN = async (req, res) => {
  const user = await UserSchema.findOne({ email: req.body.email });

  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (isPasswordMatch) {
    return res.status(200).json({ status: "LOGIN successfull" });
  }

  return res.status(401).json({ status: "LOGIN failed" });
};
