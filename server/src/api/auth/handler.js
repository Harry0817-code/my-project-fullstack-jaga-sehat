import ClientError from '../../exceptions/ClientError.js';

export default class AuthenticationHandler {
  constructor(authenticationService, userService, tokenManager, validator) {
    this._authenticationService = authenticationService;
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAuthenticationPayload(request.payload);

      const dataUser = await this._userService.verifyUserCredential(request.payload);
      
      const accessToken = this._tokenManager.generateAccessToken({ id: dataUser.id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id: dataUser.id });

      await this._authenticationService.addRefreshToken(refreshToken);

      return h.response({
        status: 'success',
        data: {
          accessToken,
          refreshToken,
          dataUser
        }
      }).code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({ status: 'fail', message: error.message })
          .code(error.statusCode);
      }

      console.error(error);
      return h
        .response({
          status: 'error',
          message: 'Terjadi kesalahan pada server',
        })
        .code(500);
    }
  }

  async putAuthenticationHandler(request, h) {
    try {
      this._validator.validatePutAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;

      await this._authenticationService.verifyRefreshToken(refreshToken);

      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
      const accessToken = this._tokenManager.generateAccessToken(id);

      return h.response({
        status: 'success',
        data: {
          accessToken
        }
      }).code(201)
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({ status: 'fail', message: error.message })
          .code(error.statusCode);
      }

      console.error(error);
      return h
        .response({
          status: 'error',
          message: 'Terjadi kesalahan pada server',
        })
        .code(500);
    }
  }

  async deleteAuthenticationHandler(request, h) {
    try {
      this._validator.validateDeleteAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;

      await this._authenticationService.deleteRefreshToken(refreshToken);

      return h.response({
        status: 'success',
        message: 'Refresh Token berhasil dihapus dan sudah logout'
      }).code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({ status: 'fail', message: error.message })
          .code(error.statusCode);
      }

      console.error(error);
      return h
        .response({
          status: 'error',
          message: 'Terjadi kesalahan pada server',
        })
        .code(500);
    }
  }
}