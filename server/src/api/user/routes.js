export default (handler) => [
  {
    method: 'POST',
    path: '/register',
    handler: handler.postUserHandler,
    options: {
      auth: false,
      cors: {
        origin: ['*']
      }
    }
  },
  {
    method: 'GET',
    path: '/user/me',
    handler: handler.getLoggedUserHandler,
    options: {
      auth: 'JagaSehatV2_JWT',
      cors: {
        origin: ['*']
      }
    }
  }
];