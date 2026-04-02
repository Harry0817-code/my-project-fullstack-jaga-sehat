export default (handler) => [
  {
    method: 'POST',
    path: '/auth',
    handler: handler.postAuthenticationHandler,
    options: { auth: false }
  },
  {
    method: 'PUT',
    path: '/auth',
    handler: handler.putAuthenticationHandler,
    options: { auth: false }
  },
  {
    method: 'DELETE',
    path: '/auth',
    handler: handler.deleteAuthenticationHandler,
    options: { auth: false }
  }
]