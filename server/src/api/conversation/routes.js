export default (handler) => [
  {
    method: 'GET',
    path: '/history/conversation/{role}',
    handler: handler.getListContactFromHistoryConversationHandler,
    options: {
      auth: 'JagaSehatV2_JWT',
      cors: {
        origin: ['*']
      }
    }
  },
]