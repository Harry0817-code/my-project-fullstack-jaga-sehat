import { BrowserRouter } from "react-router-dom";
import AuthProvider from "../context/auth/AuthProvider";
import WebSocketProvider from "../context/websocket/WebSocketProvider";
import DoctorProvider from "../context/doctor/DoctorProvider";

function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WebSocketProvider>
          <DoctorProvider>
            {children}
          </DoctorProvider>
        </WebSocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppProviders;