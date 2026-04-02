import MessageHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'messages',
  version: '1.0.0',
  register: async (server, { service }) => {
    const messageHandler = new MessageHandler(service);
    server.route(routes(messageHandler));
  }
};