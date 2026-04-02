import React from 'react';
import { Clock, Stethoscope } from 'lucide-react';

import HomeChatHistory from '../components/HomeChatHistory';

function HomePage(props) {
  const { authedUser } = props;
  
  const stored = authedUser.fullname;
  const userName = stored === null || stored === undefined ? "Pengunjung" : stored.split(' ')[0];

  return (
    <div className='container-homepage'>
      <section className='hero-section'>
        <div className="hero-content">
          <h1>Halo, <span>{userName}</span>! 👋</h1>
          <p>Kesehatan adalah investasi terbaik. Jaga pola hidup sehat dan jangan ragu untuk berkonsultasi dengan dokter profesional kami kapan saja.</p>
          <div className="hero-features">
            <div className="hero-feature">
              <Clock />
              <span>Konsultasi 24 Jam</span>
            </div>
            <div className="hero-feature">
              <Stethoscope />
              <span>Dokter Berpengalaman</span>
            </div>
          </div>
        </div>
        <div className="hero-illustration">
          <img src="/doctor-consultation.png" alt="Konsultasi dengan dokter" />
        </div>
      </section>

      <HomeChatHistory />
    </div>
  );
}

export default HomePage;