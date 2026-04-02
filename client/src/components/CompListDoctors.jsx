import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../hooks/useWebSocket.js';

function CompListDoctors(props) {
  const { id: idListDoctor, name, specialization, experience_years } = props.doctor;
  const { onlineUsers } = useWebSocket();
  const navigate = useNavigate();

  const checkIsOnline = () => {
    const isOnline = onlineUsers.some(record => record.id === idListDoctor);
    
    return isOnline;
  }

  return (
    <div className="card-list-doctor">
      <div className="header-list-doctor" onClick={() => idListDoctor && navigate(`/list-doctors/${idListDoctor}`)}>
        <img src="https://img.icons8.com/color/96/doctor-male.png" alt={name} />
        <div className="name-specialization-doctor">
          <h3>{name}</h3>
          <p className='specialization-doctor'>{specialization}</p>
          <p className='experience-doctor'>{experience_years} tahun pengalaman</p>
        </div>
        <div className="flag-connection-chat-history"
          style={{
            color: checkIsOnline()
              ? 'white'
              : '#304550',
            background: checkIsOnline()
              ? '#1dafa1'
              : '#f2f8f8'
          }}>
          {checkIsOnline() ? 'Online' : 'Offline'}
        </div>
      </div>

      <button className='btn-consultant-now'
        style={{
          opacity: checkIsOnline() ? 1 : .5
        }}
        onClick={() => navigate(`/message/${idListDoctor}`)}>
        <MessageCircle />
        {checkIsOnline() ? "Konsultasi Sekarang" : "Sedang Offline"}
      </button>
    </div>
  );
}

export default CompListDoctors;