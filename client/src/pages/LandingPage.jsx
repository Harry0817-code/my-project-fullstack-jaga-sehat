import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

import FooterLandingPage from '../components/FooterLandingPage.jsx';

function LandingPage() {
  return (
    <>
      <section className='container-landingpage'>
        <div className="section-text">
          <p className='text-first'><span><Sparkles /></span>Platform Kesehatan Terpercaya</p>
          <h1 className='text-second'>Kesehatan Anda <span>Prioritas Kami</span></h1>
          <p className='text-fourth'>Konsultasi dengan dokter profesional kapan saja, di mana saja.
            Jaga kesehatan Anda dengan layanan telemedicine terbaik.</p>
          <Link className='btn-getting-started' to={"/register"}>Gabung sekarang<span><ArrowRight /></span></Link>
        </div>
        <div className="section-img">
          <img src="/doctor-hero.png" alt="Dokter profesional siap membantu" />
        </div>
      </section>
      <footer>
        <FooterLandingPage />
      </footer>
    </>
  );
}

export default LandingPage;