import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { login } from '../utils/network-data';
import { useWebSocket } from '../hooks/useWebSocket.js';
import { useDoctor } from '../hooks/useDoctor.js';
import { useAuth } from '../hooks/useAuth.js';
import FormLogin from '../components/FormLogin';

function LoginPage(props) {
  const { setAuthedUser, setLoading } = props;
  const { fetchDoctors } = useDoctor();
  const { fetchUser } = useAuth();
  const { connect } = useWebSocket();
  const methods = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const navigate = useNavigate();

  const handlerLogin = async (dataUserLogin) => {
    setLoading(true);

    const { email, password } = dataUserLogin;
    const { error, data } = await login(email, password);

    if (error) {
      console.log('tidak berhasil');
      setLoading(false);
      return;
    }
    
    connect(data.accessToken);// untuk membuka koneksi webSocket
    setAuthedUser(prev => ({ ...prev, ...data.dataUser }));
    navigate('/');
    await fetchDoctors();
    await fetchUser();
    setLoading(false);
  }

  return (
    <section className='container-login'>
      <div className="form-login">
        <div className="caption-login">
          <h3>Selamat Datang</h3>
          <p>Yuk masuk akun Jaga Sehat anda</p>
        </div>

        <FormProvider {...methods}>
          <FormLogin handlerLogin={methods.handleSubmit(handlerLogin)} />
        </FormProvider>
      </div>
    </section>
  );
}

export default LoginPage;