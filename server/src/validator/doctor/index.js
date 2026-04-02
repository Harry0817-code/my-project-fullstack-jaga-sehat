import InvariantError from '../../exceptions/InvariantError.js';
import { DoctorPayloadSchema } from './schema.js';

const DoctorValidator = {

  validateDoctorPayload: (payload) => {
    const validationResult = DoctorPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default DoctorValidator;
