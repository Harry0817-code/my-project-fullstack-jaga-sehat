import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Undo2, Hospital, CalendarDays, Clock, MessageCircle } from 'lucide-react';
import { useDoctor } from '../hooks/useDoctor';
import { useWebSocket } from '../hooks/useWebSocket';

function DetailDoctorPage() {
  const { doctors: getListDoctors } = useDoctor();
  const { onlineUsers: listOnlineLogin } = useWebSocket();

  const { id: idDoctorParams } = useParams();
  const navigate = useNavigate();
  const detailWorkDays = [
    { id: 1, day: 'Senin' },
    { id: 2, day: 'Selasa' },
    { id: 3, day: 'Rabu' },
    { id: 4, day: 'Kamis' },
    { id: 5, day: 'Jumat' },
    { id: 6, day: 'Sabtu' },
    { id: 7, day: 'Minggu' },
  ];

  const [dataDetailDoctor, setDataDetailDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoryDoctor = () => {
      try {
        const result = getListDoctors.find(record => record.id === idDoctorParams);

        if (result) {
          setDataDetailDoctor(result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryDoctor();
  }, [getListDoctors, idDoctorParams]);

  const checkIsOnline = () => {
    const isOnline = listOnlineLogin.some(record => record.id === idDoctorParams);

    return isOnline;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const workDay = (workDayStartOrEnd) => {
    const dayObj = detailWorkDays.find((item) => item.id === workDayStartOrEnd);
    return dayObj ? dayObj.day : " ";
  }

  const workTime = (workTimeStartOrEnd) => {
    const date = new Date(`1970-01-01T${workTimeStartOrEnd}`);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  console.log(dataDetailDoctor);

  return (
    <div className="container-detail-doctor">
      <div className="nav-back-to-page-list-doctor" onClick={() => navigate('/list-doctors')}>
        <Undo2 />
        <p>Kembali ke Daftar Dokter</p>
      </div>

      <section className='section-header-detail-doctor'>
        <img src="https://img.icons8.com/color/96/doctor-male.png" alt={dataDetailDoctor.fullname} />
        <div className="header-name-and-connection-detail-doctor">
          <div className="name-detail-doctor">
            <h1>{dataDetailDoctor.name}</h1>
            <p className='specialization-detail-doctor'>{dataDetailDoctor.specialization}</p>
            <p className='experience_years-detail-doctor'>{dataDetailDoctor.experience_years} tahun pengalaman</p>
          </div>
          <div className="connection-detail-doctor"
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
      </section>

      <section className='section-info-detail-doctor'>
        <div className="about-doctor">
          <h2>Tentang Dokter</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem cupiditate facere, nemo ad ea corporis corrupti ex dolores, facilis ducimus sunt quam! Recusandae autem alias doloremque aspernatur placeat omnis quisquam.</p>
        </div>
        <div className="information-doctor">
          <h2>Informasi</h2>
          <div className="info-name-hospital">
            <Hospital />
            <div className="name-and-detail-information">
              <p className='title-detail-information'>Rumah Sakit</p>
              <p className='desc-detail-information'>{dataDetailDoctor.hospital_name}</p>
            </div>
          </div>
          <div className="info-name-hospital">
            <img src="/icon-whatsapp.png" alt="icon-whatsapp" />
            <div className="name-and-detail-information">
              <p className='title-detail-information'>Nomor Whatsapp</p>
              <p className='desc-detail-information'>{dataDetailDoctor.phone}</p>
            </div>
          </div>
          <div className="info-name-hospital">
            <CalendarDays />
            <div className="name-and-detail-information">
              <p className='title-detail-information'>Hari Praktik</p>
              <p className='desc-detail-information'>{workDay(dataDetailDoctor.workday_start) + " - " + workDay(dataDetailDoctor.workday_end)}</p>
            </div>
          </div>
          <div className="info-name-hospital" style={{ marginBottom: 0 }}>
            <Clock />
            <div className="name-and-detail-information">
              <p className='title-detail-information'>Jam Praktik</p>
              <p className='desc-detail-information'>{workTime(dataDetailDoctor.worktime_start) + " - " + workTime(dataDetailDoctor.worktime_end)}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="btn-consultant-from-detail-doctor">
        <button 
        className='btn-consultant-now' 
        style={{ opacity: checkIsOnline() ? 1 : .5 }} 
        onClick={() => navigate(`/message/${dataDetailDoctor.id}`)}>
          <MessageCircle />
          {checkIsOnline() ? "Konsultasi Sekarang" : "Sedang Offline"}
        </button>
      </div>

    </div>
  );
}

export default DetailDoctorPage;