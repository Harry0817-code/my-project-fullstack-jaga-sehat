import Joi from 'joi';

export const PromptGeminiAiSchema = Joi.object({
  gender: Joi.string().required(),
  age: Joi.number().required(),
  weight: Joi.number().required(),
  height: Joi.number().required(),
  valueBmi: Joi.number().required()
});