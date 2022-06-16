//Validation
const Joi = require("@hapi/joi");
//Registar Validation __ fonksiyona alma nedenimiz birden fazla validation isteyebiliriz

const registerValidation = (data) => {
  const schema = Joi.object().keys({
    username: Joi.string().min(3).required(),
    email: Joi.string().min(6).required().email(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    //min 8 letter password, with at least a symbol, upper and lower case letters and a number
    password: Joi.string()
      .pattern(
        new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
      )
      .required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object().keys({
    username: Joi.string().min(3).required(),
    email: Joi.string().min(3).required(),
    // password: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
