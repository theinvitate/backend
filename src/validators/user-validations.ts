import * as Joi from 'joi';
import validator from "./validator";

const signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phoneNSN: Joi.string().min(2).max(5).required(),
    phoneNumber: Joi.string().min(5).max(15).required()
});
const validateSignUp = validator(signUpSchema)

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
const validateLogin = validator(loginSchema);

export { validateSignUp, validateLogin };