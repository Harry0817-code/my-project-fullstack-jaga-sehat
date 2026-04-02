import ClientError from '../../exceptions/ClientError.js'

export default class ConversationHandler {
  constructor(service, validator) {
    this._service = service,
      this._validator = validator

    this.getListContactFromHistoryConversationHandler = this.getListContactFromHistoryConversationHandler.bind(this);
  }

  async getListContactFromHistoryConversationHandler(request, h) {
    try {
      const { id } = request.auth.credentials;
      const { role: throwRoleForListContact } = request.params;

      const data = await this._service.getListContactFromHistoryConversation(id, throwRoleForListContact);

      return h.response({
        status: 'success',
        data
      }).code(200);
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}