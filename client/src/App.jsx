import { useEffect, useState } from 'react'
import { Routes, Route } from "react-router-dom";
import { getUserLogged, getAccessToken } from './utils/network-data.js';
import { useWebSocket } from './hooks/useWebSocket.js';
import { useAuth } from './hooks/useAuth.js';
import { useDoctor } from './hooks/useDoctor.js';

import Navigations from "./components/Navigations.jsx";
import Loading from './components/Loading.jsx';
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ListDoctorPage from './pages/ListDoctorPage.jsx';
import DetailDoctorPage from './pages/DetailDoctorPage.jsx';
import MessagePage from './pages/MessagePage.jsx';
import CheckBMICalculatorPage from './pages/CheckBMICalculatorPage.jsx';
import DashboardDoctorPage from './pages/DashboardDoctorPage.jsx';
import DashboardAdminPage from './pages/DashboardAdminPage.jsx';

function App() {
  const { connect } = useWebSocket();
  const { fetchDoctors } = useDoctor();
  const { fetchUser } = useAuth();

  const [authedUser, setAuthedUser] = useState({});
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUserLogged() {
      setLoading(true);
      if (!localStorage.getItem("accessToken")) {
        setAuthedUser(prev => ({ ...prev, role: 'guest' }));
        setInitializing(false);
        setLoading(false);
        return;
      }

      const { data } = await getUserLogged();

      connect(getAccessToken());// untuk membuka koneksi webSocket
      setAuthedUser(prev => ({ ...prev, ...data }));
      setInitializing(false);

      await fetchDoctors();
      await fetchUser();
      setLoading(false);
    }

    fetchUserLogged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (initializing) {
    return null;
  }

  const routeConfig = {
    user: [
      { path: "/", element: <HomePage authedUser={authedUser} /> },
      { path: "/list-doctors", element: <ListDoctorPage /> },
      { path: "/list-doctors/:id", element: <DetailDoctorPage /> },
      { path: "/message/:id", element: <MessagePage myUserId={authedUser.id} /> },
      { path: "/check-ideal", element: <CheckBMICalculatorPage /> },
    ],
    guest: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <LoginPage setAuthedUser={setAuthedUser} setLoading={setLoading} /> },
      { path: "/register", element: <RegisterPage /> },
    ],
    doctor: [
      { path: "/", element: <DashboardDoctorPage /> },
    ],
    admin: [
      {path: "/", element: <DashboardAdminPage />}
    ]
  };
  const isRole = authedUser.role || "guest";
  const setRoute = routeConfig[isRole];

  return (
    <>
      <header>
        <Navigations authedUser={authedUser} setAuthedUser={setAuthedUser} setLoading={setLoading} />
      </header>
      <main>
        {loading ? <Loading status={'loading'} notif={'Loading...'} /> :
          <Routes>
            {setRoute.map((ele, idx) => (
              <Route key={idx} path={ele.path} element={ele.element} />
            ))}
            <Route path="/*" element={<p>404 | Not Found</p>} />
          </Routes>
        }
      </main>
    </>
  )
}

export default App
