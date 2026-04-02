import PromptGeminiAiHandler from "./handler.js";
import routes from "./routes.js";

export default {
  name: 'promptGeminiAi',
  version: '1.0.0',
  register: async (server, {
    promptGeminiAiService,
    validator
  }) => {
    const promptGeminiAiHandler = new PromptGeminiAiHandler(
      promptGeminiAiService,
      validator
    );
    server.route(routes(promptGeminiAiHandler));
  }
};