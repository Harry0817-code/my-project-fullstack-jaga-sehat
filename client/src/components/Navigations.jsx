import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartHandshake, LogOut } from 'lucide-react';
import { clearTokens, deleteRefreshToken, getRefreshToken } from '../utils/network-data';
import { useWebSocket } from "../hooks/useWebSocket.js";

function Navigations(props) {
  const { authedUser, setAuthedUser, setLoading } = props;
  const { disconnect } = useWebSocket();
  const roleUser = authedUser.role;
  const navigate = useNavigate();

  const linkConfig = {
    user: [
      { to: "/", className: 'nav-general', menu: 'Beranda' },
      { to: "/list-doctors", className: 'nav-general', menu: 'Daftar Dokter' },
      { to: "/check-ideal", className: 'nav-general', menu: 'Cek Berat Ideal' },
    ],
    guest: [
      { to: "/login", className: 'nav-general', menu: 'Masuk' },
      { to: "/register", className: 'nav-specific', menu: 'Daftar' },
    ],
  };
  const setMenu = linkConfig[roleUser];

  const handlerLogout = async () => {
    setLoading(true);
    await deleteRefreshToken(getRefreshToken());
    disconnect();
    clearTokens();
    setAuthedUser(prev => ({ ...prev, role: 'guest' }));

    navigate('/login');
    setLoading(false);
  }

  return (
    <>
      <div className="logo-header">
        <Link to="/">
          <span><HeartHandshake style={{ width: '1.8rem', height: '1.8rem' }} /></span>
          <p>Jaga Sehat</p>
        </Link>
      </div>
      <div className="menu-nav">
        {['user', 'guest'].includes(roleUser) && (
          setMenu.map((ele, idx) => (
            <Link key={idx} to={ele.to} className={ele.className}>{ele.menu}</Link>
          ))
        )}

        {['user', 'doctor', 'admin'].includes(roleUser) && (
          <div className="icon-logout" onClick={handlerLogout}>
            <LogOut />
          </div>
        )}
      </div>
    </>
  );
}

export default Navigations;