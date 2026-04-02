import ConversationHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'conversation',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const conversationHandler = new ConversationHandler(service, validator);
    server.route(routes(conversationHandler));
  }
};