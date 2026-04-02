import React from 'react';
import { useFormContext } from "react-hook-form";
import { User, Mail, Lock, Calendar, ArrowRight } from 'lucide-react';

function FormRegister(props) {
  const { register } = useFormContext();
  const { confirmPassword, setConfirmPassword, handlerClickRegister, password } = props;
  
  return (
    <form action="submit" className='grup-input-register'>
      <div className="label-input-form-first">
        <label htmlFor="full_name">Nama Lengkap</label>
        <div className="icon-input-register">
          <User />
          <input type="text" id='full_name' placeholder='ketik nama lengkap anda' {...register('fullName', {required: true})} />
        </div>
      </div>

      <div className="label-input-form">
        <label htmlFor="gender-option">Jenis Kelamin</label>
        <div className="btn-radio-gender">
          <div className="gender-man">
            <label htmlFor="male">Laki - Laki</label>
            <input type="radio" id='male' value='Laki - Laki' {...register('gender', {required: true})} />
          </div>
          <div className="gender-woman">
            <label htmlFor="woman">Perempuan</label>
            <input type="radio" id='woman' value='Perempuan' {...register('gender', {required: true})} />
          </div>
        </div>
      </div>

      <div className="label-input-form">
        <label htmlFor="birthday">Tanggal Lahir</label>
        <div className="icon-input-register">
          <Calendar />
          <input type="date" id='birthday' {...register('birthday', {required: true})} />
        </div>
      </div>

      <div className="label-input-form">
        <label htmlFor="email">Email</label>
        <div className="icon-input-register">
          <Mail />
          <input type="email" id='email' placeholder='nama@gmail.com' {...register('email', {required: true})} />
        </div>
      </div>

      <div className="label-input-form">
        <label htmlFor="password">Password</label>
        <div className="icon-input-register">
          <Lock />
          <input type="password" id='password' placeholder='••••••••' {...register('password', {required: true})} />
        </div>
      </div>

      <div className="label-input-form">
        <label htmlFor="confirm-password">Konfirmasi Password</label>
        <div className="icon-input-register">
          <Lock />
          <input type="password" id='confirm-password' placeholder='••••••••' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        {password !== confirmPassword && <p style={{ color: 'red', fontSize: '12px'}}>Password tidak sama</p>}
      </div>

      <button onClick={handlerClickRegister}>Daftar <ArrowRight /></button>
    </form>
  );
}

export default FormRegister;