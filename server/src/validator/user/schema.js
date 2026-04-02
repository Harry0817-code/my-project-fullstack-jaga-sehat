import Joi from 'joi';

export const UserPayloadSchema = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  birthday: Joi.date().required(),
  gender: Joi.string().required()
});