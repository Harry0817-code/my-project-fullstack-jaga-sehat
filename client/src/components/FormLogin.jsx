import React from 'react';
import { Link } from 'react-router-dom';
import { useFormContext } from "react-hook-form";
import { Mail, Lock, ArrowRight } from 'lucide-react';

function FormLogin(props) {
  const { handlerLogin } = props;
  const { register } = useFormContext();

  return (
    <>
      <form onSubmit={handlerLogin} className='grup-input-login'>
        <div className="label-input-form-first">
          <label htmlFor="email">Email</label>
          <div className="icon-input-login">
            <Mail />
            <input type="text" id='email' placeholder='nama@gmail.com' {...register('email', { required: true })} />
          </div>
        </div>
        <div className="label-input-form">
          <label htmlFor="password">Password</label>
          <div className="icon-input-login">
            <Lock />
            <input type="password" id='password' placeholder='••••••••' {...register('password', { required: true })} />
          </div>
        </div>
        <button type='submit'>Masuk <ArrowRight /></button>
      </form>

      <div className="doesnt-have-account">
        <p>Belum punya akun? <Link to={'/register'}>Klik untuk daftar</Link></p>
      </div>
    </>
  );
}

export default FormLogin;