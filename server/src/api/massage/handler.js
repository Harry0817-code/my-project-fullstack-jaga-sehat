import ClientError from '../../exceptions/ClientError.js'

export default class MessageHandler {
  constructor(service) {
    this._service = service;

    this.getAllMessagesHandler = this.getAllMessagesHandler.bind(this);
    this.putMarkUnreadMessagesAsReadnameHandler = this.putMarkUnreadMessagesAsReadnameHandler.bind(this);
  }

  async getAllMessagesHandler(request, h) {
    try {
      const idLogin = request.auth.credentials.id;
      const allMessages = await this._service.getAllMessages(idLogin);

      return h.response({
        status: 'success',
        data: allMessages
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

  async putMarkUnreadMessagesAsReadnameHandler(request, h) {
    try {
      const conversationId = request.payload;

      await this._service.putMarkUnreadMessagesAsReadname(conversationId);

      return h.response({
        status: 'success',
        message: 'Update Unread Message berhasil'
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