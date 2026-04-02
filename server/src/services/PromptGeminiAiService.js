import { Pool } from "pg";
import NotFoundError from '../exceptions/NotFoundError.js'

export default class PromptGeminiAiService {
  constructor(model) {
    this._model = model;
    this._pool = new Pool();
  }

  async getSuggestions({ gender, age, weight, height, valueBmi }) {
    const prompt = `Data pengguna:
                  - Jenis kelamin: ${gender}
                  - Usia: ${age}
                  - Berat badan: ${weight} kg
                  - Tinggi badan: ${height} cm
                  - BMI: ${valueBmi}

                  tolong berikan 4 saran dari data yang saya kirim 
                  dalam bahasa Indonesia agar pengguna mencapai atau 
                  mempertahankan BMI normal, 
                  Dan tambahkan emoji pada awal poin yang relevan pada setiap saran. `;
    
    const result = await this._model.generateContent(prompt) ?? (() => {throw new NotFoundError('Gagal dalam generate prompt')})();

    return result.response.text();
  }
}