import 'dotenv/config';
import Jwt from '@hapi/jwt';
import InvariantError from '../exceptions/InvariantError.js';

const TokenManager = {
  generateAccessToken: (payload) =>
    Jwt.token.generate(
      payload,
      process.env.ACCESS_TOKEN_KEY,
      {
        ttlSec: Number(process.env.ACCESS_TOKEN_AGE), // (30 menit)
      }
    ),

  generateRefreshToken: (payload) =>
    Jwt.token.generate(
      payload,
      process.env.REFRESH_TOKEN_KEY,
      {
        ttlSec: Number(process.env.REFRESH_TOKEN_AGE), // (7 hari)
      }
    ),

  verifyAccessToken: (accessToken) => {
    try {
      const artifacts = Jwt.token.decode(accessToken);
      Jwt.token.verifySignature(
        artifacts,
        process.env.ACCESS_TOKEN_KEY
      );

      return artifacts.decoded.payload;
    } catch {
      throw new InvariantError('Access token tidak valid');
    }
  },

  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(
        artifacts,
        process.env.REFRESH_TOKEN_KEY
      );

      return artifacts.decoded.payload;
    } catch {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

export default TokenManager;
