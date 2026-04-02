export function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return {
      status: 'Berat Badan Kurang',
      statusClass: 'underweight',
      feedback: 'Anda memiliki berat badan yang kurang. Disarankan untuk menambah asupan kalori sehat dan konsultasi dengan ahli gizi.'
    };
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return {
      status: 'Berat Badan Ideal',
      statusClass: 'normal',
      feedback: 'Selamat! Berat badan Anda berada dalam kisaran ideal. Pertahankan pola hidup sehat Anda.'
    };
  } else if (bmi >= 25 && bmi <= 29.9) {
    return {
      status: 'Berat Badan Berlebih',
      statusClass: 'overweight',
      feedback: 'Anda memiliki berat badan berlebih. Pertimbangkan untuk mengatur pola makan dan meningkatkan aktivitas fisik.'
    };
  } else {
    return {
      status: 'Obesitas',
      statusClass: 'obese',
      feedback: 'Anda berada dalam kategori obesitas. Sangat disarankan untuk berkonsultasi dengan dokter atau ahli gizi untuk program penurunan berat badan.'
    };
  }
} 