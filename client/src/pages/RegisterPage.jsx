import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';

import { register } from '../utils/network-data.js';
import FormRegister from '../components/FormRegister.jsx';
import Loading from '../components/Loading.jsx';

function RegisterPage() {
  const methods = useForm({
    defaultValues: {
      fullName: '',
      gender: '',
      birthday: '',
      email: '',
      password: ''
    }
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [notif, setNotif] = useState('');
  const navigate = useNavigate();

  const handlerClickRegister = async (data) => {
    if (data.password === confirmPassword) {
      try {
        setStatus('loading');
        setNotif('Sedang menyimpan data...');

        const { fullName: fullname, email, password, birthday, gender } = data;

        await register({ fullname, email, password, birthday, gender });

        setStatus('success');
        setNotif('Data berhasil disimpan');
      } catch {
        setNotif('Gagal menyimpan');
      }
    }
  };

  // auto close notif sukses
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setStatus('idle');
        navigate('/login');
      }, 2000);

      return () => clearTimeout(timer);
    }
    else if (notif === 'Gagal menyimpan') {
      const timer = setTimeout(() => {
        setStatus('idle');
        navigate('/register');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [navigate, status, notif]);

  return (
    <section className='container-register'>
      <div className="form-register">
        <div className="caption-register">
          <h3>Selamat Bergabung</h3>
          <p>Yuk buat akun Jaga Sehat agar sehat anda terjaga</p>
        </div>

        <FormProvider {...methods}>
          <FormRegister
            password={methods.getValues('password')}
            handlerClickRegister={methods.handleSubmit(handlerClickRegister)}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword} />
        </FormProvider>

        <div className="does-have-account">
          <p>Sudah punya akun? <Link to={'/login'}>Klik untuk masuk</Link></p>
        </div>
      </div>

      <Loading status={status} notif={notif} />
    </section>
  );
}

export default RegisterPage;