import Joi from "joi";

const userValidation = Joi.object({
  firstname: Joi.string().min(3).max(20).required().alphanum(),
  lastname: Joi.string().min(3).max(20).alphanum(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .regex(
      new RegExp("^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$")
    )
    .required(),
});
