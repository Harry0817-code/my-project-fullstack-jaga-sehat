import React, { useMemo, useState } from 'react';
import { LIST_RANDOM_QUOTE } from '../utils/ListRandomQuote.js';

function FooterLandingPage() {
  const [countRandomQuote, setCountRandomQuote] = useState(0);

  const randomQuote = useMemo(() => (LIST_RANDOM_QUOTE[countRandomQuote]), [countRandomQuote]);

  const HandlerClickQuote = () => {
    setCountRandomQuote(prev => {
      const nextCount = Math.floor(Math.random() * LIST_RANDOM_QUOTE.length);

      if (prev === nextCount) {
        return prev === 0 ? prev + 1 : prev - 1;
      }
      return nextCount;
    })
  }

  return (
    <>
      <div className="footer-text-first">
        <blockquote onClick={() => HandlerClickQuote()} style={{ cursor: 'pointer' }}>"{randomQuote}"</blockquote>
        <p>Mulailah perjalanan kesehatanmu hari ini, karena setiap langkah kecil membawa perubahan besar.</p>
      </div>
      <div className="footer-credits">
        <p>Dibuat dengan ❤️ oleh
          <a href="https://www.linkedin.com/in/harryns/" target='_blank'> linkedin.com/in/harryns</a>
        </p>
      </div>
    </>
  );
}

export default FooterLandingPage;