import Joi from 'joi';

export const DoctorPayloadSchema = Joi.object({
  name: Joi.string().required(),
  specialization: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  hospital_name: Joi.string().required(),
  hospital_address: Joi.string().required(),
  experience_years: Joi.number().required(),
  workday_start: Joi.number().required(),
  workday_end: Joi.number().required(),
  worktime_start: Joi.string().required(),
  worktime_end: Joi.string().required()
});