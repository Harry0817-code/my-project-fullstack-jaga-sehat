import React, { useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

function CompMessage(props) {
  const { myUserId, displayHeaderMessage, messages, handlerSendMessage } = props;
  const { register } = useFormContext();
  const messagesEndRef = useRef(null);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const time = new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta'
    }).format(date);

    return time;
  };

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="header-message">
        <div className="background-img-header-message">
          <img
            src="https://img.icons8.com/color/96/doctor-male.png"
            alt={displayHeaderMessage?.name}
          />
        </div>
        <div className="name-and-specialization-message">
          <p className='name-contact-message'>
            {displayHeaderMessage?.name}
          </p>
          <p className='specialization-contact-message'>
            {displayHeaderMessage?.specialization}
          </p>
        </div>
      </div>

      <div className="message">
        {messages
          .filter(msg => msg?.message?.trim())
          .map((msg, index) => (
            <div
              key={index}
              style={{
                width: "100%",
                display: "flex",
                justifyContent:
                  msg.account_id === myUserId
                    ? "flex-end"
                    : "flex-start",
                marginBottom: "10px"
              }}
            >
              <div
                className="list-message"
                style={{
                  color:
                    msg.account_id === myUserId
                      ? "white"
                      : "hsl(200 25% 15%)",
                  background:
                    msg.account_id === myUserId
                      ? "hsl(174 72% 40%)"
                      : "hsl(180 15% 94%)"
                }}
              >
                <p>{msg.message}</p>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent:
                      msg.account_id === myUserId
                        ? "flex-end"
                        : "flex-start",
                    color:
                      msg.account_id === myUserId
                        ? "hsl(0 0% 100% / .7)"
                        : "hsl(200 15% 45%)",
                  }}
                >
                  <span>{formatTime(msg.created_at)}</span>
                </div>
              </div>
            </div>
          ))}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handlerSendMessage}>
        <div className="input-and-btn-message">
          <input
            type="text"
            placeholder='Ketik pesan...'
            {...register('sendMessage', { required: true })}
          />
          <button type='submit'>
            <Send />
          </button>
        </div>
      </form>
    </>
  );
}

export default CompMessage;
