import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import ResultCard from '../components/CheckBMICalculator/ResultCard.jsx';
import InputFormBMI from '../components/CheckBMICalculator/InputFormBMI.jsx';
import { getBMICategory } from '../utils/getBMICategory.js';
import { addPromptGenAi } from '../utils/network-data.js';

function CheckBMICalculatorPage() {
  const methods = useForm({
    defaultValues: {
      gender: '',
      age: '',
      weight: '',
      height: ''
    }
  });

  const [bmiResultCard, setBmiResultCard] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [repeatSuggest, setRepeatSuggest] = useState(false);;

  const onSubmit = async (dataUser) => {
    if (dataUser) {
      setRepeatSuggest(true);
      setAiSuggestion('');
      const { gender } = dataUser;
      const age = Number(dataUser.age);
      const weight = Number(dataUser.weight);
      const height = Number(dataUser.height);

      const heightInMeters = height / 100;
      const valueBmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));

      const category = getBMICategory(valueBmi);

      setBmiResultCard({
        bmi: valueBmi,
        ...category,
        gender: gender,
        age: age,
        height: height,
        weight: weight
      });

      const { data } = await addPromptGenAi({ gender, age, weight, height, valueBmi });
      setAiSuggestion(data);
      setRepeatSuggest(false);
    } else {
      alert('Mohon masukkan berat dan tinggi yang valid.');
      setBmiResultCard(null);
      setAiSuggestion('');
    }
  }

  const resetCalculation = () => {
    setBmiResultCard(null);
    setAiSuggestion('');
  }

  return (
    <div className="bmi-calculator">
      <FormProvider {...methods}>
        <InputFormBMI onSubmit={methods.handleSubmit(onSubmit)} repeatSuggest={repeatSuggest} />
      </FormProvider>

      <div className="info-container">
        <div className="info-text">
          <h1>Temukan Angka Ideal untuk Tubuh Sehatmu!</h1>
          <p>
            Gunakan kalkulator kami untuk memeriksa Indeks Massa Tubuh (IMT) Anda dan cari tahu apakah berat badan Anda berada dalam kisaran yang sehat. Cukup masukkan data Anda untuk memulai.
          </p>
        </div>

        {bmiResultCard && (
          <ResultCard bmiResult={bmiResultCard} onClose={resetCalculation} />
        )}

        {repeatSuggest && (
          <div className="groq-loading">
            <span className="groq-spinner" />
            <span>Meminta saran AI personal...</span>
          </div>
        )}

        {aiSuggestion && (
          <div className="groq-recommendation">
            <h4><span className="emoji">🤖</span> Berikut Saran dari AI (Gemini)</h4>
            <p>{aiSuggestion}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckBMICalculatorPage;