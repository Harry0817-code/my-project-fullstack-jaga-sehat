import DoctorsHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'doctor',
  version: '1.0.0',
  register: async (server, { service, userService, validator }) => {
    const doctorsHandler = new DoctorsHandler(service, userService, validator);
    server.route(routes(doctorsHandler));
  }
};