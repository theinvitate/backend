import * as Joi from 'joi';

const validator = (schema: Joi.ObjectSchema<Joi.Schema>) => (payload) =>
	schema.validate(payload, { abortEarly: false });

export default validator;
