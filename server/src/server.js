import 'dotenv/config';

import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import { GoogleGenerativeAI } from '@google/generative-ai'

// Token Manager
import TokenManager from './tokenize/TokenManager.js';

// Gemini AI
import PromptGeminiAi from './api/promptGeminiAi/index.js';
import PromptGeminiAiService from './services/PromptGeminiAiService.js';
import PromptGeminiAiValidator from './validator/promptGeminiAi/index.js';

// WebSocket and Message
import { initWebSocket } from './websocket/websocket.js';
import Message from './api/massage/index.js';
import MessageService from './services/MessageService.js';

// Conversation
import Conversation from './api/conversation/index.js';
import ConversationService from './services/ConversationService.js';

// User
import User from './api/user/index.js';
import UserService from './services/UserService.js';
import UserValidator from './validator/user/index.js';

// Authentication
import Authentication from './api/auth/index.js';
import AuthenticationService from './services/AuthenticationService.js';
import AuthenticationValidator from './validator/auth/index.js';

// Doctor
import Doctor from './api/doctor/index.js';
import DoctorService from './services/DoctorService.js';
import DoctorValidator from './validator/doctor/index.js'

const init = async () => {
  const authenticationService = new AuthenticationService();
  const userService = new UserService();
  const doctorService = new DoctorService();
  const messageService = new MessageService();
  const conversationService = new ConversationService();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const modelGenAI = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
  const promptGeminiAiService = new PromptGeminiAiService(modelGenAI);

  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
        additionalExposedHeaders: ['cache-Control', 'Content-Length', 'X-Requested-With', 'accept', 'origin', 'authorization', 'content-type']
      }
    }
  });

  await server.register([{ plugin: Jwt }]);

  server.auth.strategy('JagaSehatV2_JWT', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: Number(process.env.ACCESS_TOKEN_AGE)
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  });

  await server.register([
    {
      plugin: User,
      options: {
        service: userService,
        validator: UserValidator
      }
    },
    {
      plugin: Authentication,
      options: {
        authenticationService,
        userService,
        tokenManager: TokenManager,
        validator: AuthenticationValidator
      }
    },
    {
      plugin: Doctor,
      options: {
        service: doctorService,
        userService,
        validator: DoctorValidator
      }
    },
    {
      plugin: PromptGeminiAi,
      options: {
        promptGeminiAiService,
        validator: PromptGeminiAiValidator
      }
    },
    {
      plugin: Message,
      options: {
        service: messageService,
      }
    },
    {
      plugin: Conversation,
      options: {
        service: conversationService,
      }
    },
  ]);

  console.log('🚀 Port yang akan digunakan:', process.env.PORT);
  await server.start();
  console.log(`Server is running on ${server.info.uri}`);

  server.table().forEach((route) => {
    console.log(`➡️  ${route.method.toUpperCase()} ${route.path}`);
  });

  // Init WebSocket
  initWebSocket(server, messageService, conversationService);
}

init();