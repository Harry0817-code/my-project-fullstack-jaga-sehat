export default (handler) => [
  {
    method: 'GET',
    path: "/messages",
    handler: handler.getAllMessagesHandler,
    options: {
      auth: 'JagaSehatV2_JWT',
      cors: {
        origin: ['*']
      }
    }
  },
  {
    method: 'PUT',
    path: "/messages",
    handler: handler.putMarkUnreadMessagesAsReadnameHandler,
    options: {
      auth: false,
      cors: {
        origin: ['*']
      }
    }
  }
];