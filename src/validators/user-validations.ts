import * as Joi from 'joi';
import validator from './validator';

const validateSignUp = validator(
	Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
		firstName: Joi.string().min(2).max(50).required(),
		lastName: Joi.string().min(2).max(50).required(),
		phoneNSN: Joi.string().min(2).max(5).required(),
		phoneNumber: Joi.string().min(5).max(15).required(),
	}),
);

const validateLogin = validator(
	Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	}),
);

export { validateSignUp, validateLogin };
