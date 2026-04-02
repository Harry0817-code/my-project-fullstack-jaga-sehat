import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

function CompTableAdminDashboard(props) {
  const { showListDoctor, setShowPopUp, inputWorkDay } = props;

  const workDay = (workDayStartOrEnd) => {
    const dayObj = inputWorkDay.find((item) => item.id === workDayStartOrEnd);
    return dayObj ? dayObj.desc : " ";
  }

  const workTime = (time) => {
    const date = new Date(`1970-01-01T${time}`);
    return date.toLocaleTimeString('id-ID', {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };
  return (
    <table>
      <thead>
        <tr>
          <th>No</th>
          <th>Nama</th>
          <th>Email</th>
          <th>Spesialis</th>
          <th>Rumah Sakit</th>
          <th>Jam Kerja</th>
          <th>Hari Kerja</th>
          <th>Tanggal bergabung</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {showListDoctor.map((record, idx) => (
          <tr key={idx}>
            <td>{idx + 1}</td>
            <td style={{ textAlign: 'start' }}>{record.name}</td>
            <td style={{ textAlign: 'start' }}>{record.email}</td>
            <td>{record.specialization}</td>
            <td>{record.hospital_name}</td>
            <td>{workTime(record.worktime_start) + " - " + workTime(record.worktime_end)}</td>
            <td>{workDay(record.workday_start) + " - " + workDay(record.workday_end)}</td>
            <td>{formatDate(record.join_date)}</td>
            <td>
              <div className="button-table-dashboard-admin">
                <button className='button-edit' onClick={() => setShowPopUp({ id: record.id, type: 'put', show: true })}><Pencil />Edit</button>
                <button className='button-delete' onClick={() => setShowPopUp({ id: record.id, type: 'del', show: true })}><Trash2 />Hapus</button>

              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CompTableAdminDashboard;