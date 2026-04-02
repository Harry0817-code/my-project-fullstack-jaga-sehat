import React from 'react';

function RegisterFeedback(props) {
  const { status, notif } = props;
  
  return (
    <>
      {status !== 'idle' && <div className="overlay" />}

      {status === 'loading' && (
        <div className="notification loading">
          <div className="spinner" />
          <span>{notif}</span>
        </div>
      )}

      {status === 'success' && (
        <div className="notification success">
          {notif}
        </div>
      )}
    </>
  );
}

export default RegisterFeedback;