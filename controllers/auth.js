const Joi = require("joi");
const HttpStatus = require("http-status-codes");
const User = require("../models/userModels");
const Helpers = require("../Helpers/helpers");
const bcrypt = require("bcryptjs");
module.exports = {
  async CreateUser(req, res) {
    const schema = Joi.object().keys({
      username: Joi.string()
        .min(5)
        .max(10)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(5)
        .required()
    });
    const { error, value } = Joi.validate(req.body, schema);
    console.log(value);
    if (error && error.details) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.details });
    }

    // const userEmail = await User.findOne({
    //   email: Helpers.lowerCase(value.email)
    // });
    // if (value.email) {
    //   return res
    //     .status(HttpStatus.CONFLICT)
    //     .json({ message: "Email already exist" });
    // }
    // const userName = await User.findOne({
    //   username: Helpers.firstUpper(value.userName)
    // });
    // if (userName) {
    //   return res
    //     .status(HttpStatus.CONFLICT)
    //     .json({ message: "Username already exist" });
    // }
    return bcrypt.hash(value.password, 10, (err, hash) => {
      if (err) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Error hashing password" });
      }
      // const body = {
      //   username: Helpers.firstUpper(value.userName),
      //   email: Helpers.lowerCase(value.email),
      //   password: hash
      // };
      User.create(req.body)
        .then(user => {
          res
            .status(HttpStatus.CREATED)
            .json({ message: "User created successfully", user });
        })
        .catch(err => {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Error Occured" });
        });
    });
  }
};
