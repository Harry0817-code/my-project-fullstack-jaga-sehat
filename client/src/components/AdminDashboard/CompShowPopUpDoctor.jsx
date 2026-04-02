import React, { useCallback, useEffect } from 'react';
import { useFormContext } from "react-hook-form";

function CompShowPopUpDoctor(props) {
  const { register, reset } = useFormContext();
  const { setShowPopUp, showPopUp, handlerSubmit, inputWorkDay, listDoctors } = props;
  const idDoctor = showPopUp.id;

  const getDesc = useCallback(() => {
    if (showPopUp.type === 'put') {
      const filterDoctor = listDoctors.find(record => record.id === idDoctor);

      return filterDoctor;
    }
  }, [idDoctor, listDoctors, showPopUp.type])

  useEffect(() => {
    const data = getDesc();
    if (data) {
      reset({
        name: data.name,
        specialization: data.specialization,
        email: data.email,
        phone: data.phone,
        hospital_name: data.hospital_name,
        hospital_address: data.hospital_address,
        experience_years: data.experience_years,
        workday_start: data.workday_start,
        workday_end: data.workday_end,
        worktime_start: data.worktime_start,
        worktime_end: data.worktime_end,
      });
    }
  }, [getDesc, reset, showPopUp]);

  const selectedDoctorForDelete = listDoctors.find(record => record.id === idDoctor);

  return (
    <div className='modal-overlay'>
      <div className="modal-content">
        {showPopUp.type === 'del' ? (
          <div className="modal-delete">
            <div className="header-modal-delete">
              <h2>Hapus {selectedDoctorForDelete?.name}</h2>
              <p>Apakah anda yakin ingin menghapusnya?</p>
            </div>
            <div className="button-modal-delete">
              <button className='button-del' onClick={handlerSubmit}>Hapus</button>
              <button className='button-cancel' onClick={() => setShowPopUp(prev => ({ ...prev, type: '', show: false }))}>Batal</button>
            </div>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2>{showPopUp.type === 'post' ? 'Tambah Dokter Baru' : 'Edit Data Dokter'}</h2>
              <p>{showPopUp.type === 'post' ? 'Masukkan data dokter yang ingin ditambahkan' : 'Perbarui informasi dokter'}</p>
            </div>
            <form action="submit" className='modal-form'>
              <div className="left-modal-content">
                <div className="label-input-form-dashboard-admin" >
                  <label htmlFor="fullName">Nama Lengkap</label>
                  <input type="text" placeholder='Masukan Nama Lengkap' {...register('name', { required: true })} />
                </div>
                <div className="label-input-form-dashboard-admin" >
                  <label htmlFor="specialization">Spesialis</label>
                  <input type="text" placeholder='Masukan Spesialis' {...register('specialization', { required: true })} />
                </div>
                <div className="label-input-form-dashboard-admin" >
                  <label htmlFor="email">Email</label>
                  <input type="text" placeholder='Masukan Email' {...register('email', { required: true })} />
                </div>
                <div className="label-input-form-dashboard-admin" >
                  <label htmlFor="phone">Nomor Handphone</label>
                  <input type="text" placeholder='Masukan Nomor Handphone' {...register('phone', { required: true })} />
                </div>
                <div className="label-input-form-dashboard-admin" >
                  <label htmlFor="hospital_name">Nama Rumah Sakit</label>
                  <input type="text" placeholder='Masukan Nama Rumah Sakit' {...register('hospital_name', { required: true })} />
                </div>
              </div>
              <div className="right-modal-content">
                <div className="label-input-form-dashboard-admin" >
                  <label htmlFor="hospital_address">Alamat Rumah Sakit</label>
                  <input type="text" placeholder='Masukan Alamat Rumah Sakit' {...register('hospital_address', { required: true })} />
                </div>
                <div className="label-input-form-dashboard-admin" >
                  <label htmlFor="experience_years">Tahun Pengalaman</label>
                  <input type="text" placeholder='Masukan Berapa tahun pengalaman' {...register('experience_years', { required: true })} />
                </div>
                <div className="label-input-form-dashboard-admin" >
                  <label htmlFor="workday">Hari Kerja</label>
                  <div className="drop-down-workday-form">
                    <select {...register('workday_start', { required: true })} >
                      <option value="">Pilih Hari Kerja</option>
                      {inputWorkDay.map(record => (
                        <option key={record.id} value={record.id}>
                          {record.desc}
                        </option>
                      ))}
                    </select>
                    __
                    <select {...register('workday_end', { required: true })} >
                      <option value="">Pilih Hari Kerja</option>
                      {inputWorkDay.map(record => (
                        <option key={record.id} value={record.id}>
                          {record.desc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="label-input-form-dashboard-admin" >
                  <label htmlFor="worktime_start">Jam Kerja (mulai)</label>
                  <input type="text" placeholder='Masukan Jam Kerja Awal' {...register('worktime_start', { required: true })} />
                </div>
                <div className="label-input-form-dashboard-admin" >
                  <label htmlFor="worktime_end">Jam Kerja (Akhir)</label>
                  <input type="text" placeholder='Masukan Jam Kerja (Akhir)' {...register('worktime_end', { required: true })} />
                </div>
              </div>
            </form>
            <div className="button-modal-form-dashboard-admin">
              <button className='button-save' onClick={handlerSubmit}>Simpan</button>
              <button className='button-cancel' onClick={() => {
                setShowPopUp(prev => ({ ...prev, type: '', show: false }))
                reset({
                  name: '',
                  specialization: '',
                  email: '',
                  phone: '',
                  hospital_name: '',
                  hospital_address: '',
                  experience_years: '',
                  workday_start: '',
                  workday_end: '',
                  worktime_start: '',
                  worktime_end: '',
                });
              }}>Batal</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CompShowPopUpDoctor;