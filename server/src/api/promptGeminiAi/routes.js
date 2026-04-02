export default (handler) => [
  {
    method: 'POST',
    path: '/api/analyze',
    handler: handler.postPromptGeminiAi,
    options: {
      auth: false,
      cors: {
        origin: ['*']
      }
    }
  }
];