import InvariantError from '../../exceptions/InvariantError.js';
import { PromptGeminiAiSchema } from './schema.js';

const PromptGeminiAiValidator = {
  validatePromptGeminiAiPayload: (payload) => {
    const validationResult = PromptGeminiAiSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default PromptGeminiAiValidator;