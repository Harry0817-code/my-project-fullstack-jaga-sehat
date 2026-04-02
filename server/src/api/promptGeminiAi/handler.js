import ClientError from '../../exceptions/ClientError.js'

export default class PromptGeminiAiHandler {
  constructor(promptGeminiAiService, validator) {
    this._promptGeminiAiService = promptGeminiAiService;
    this._validator = validator;
    
    this.postPromptGeminiAi = this.postPromptGeminiAi.bind(this);
  }

  async postPromptGeminiAi(request , h) {
    try {
      this._validator.validatePromptGeminiAiPayload(request.payload);

      const result = await this._promptGeminiAiService.getSuggestions(request.payload);
      
      return h.response({
        status: 'success',
        message: 'Suggest AI berhasil didapatkan',
        data: result
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