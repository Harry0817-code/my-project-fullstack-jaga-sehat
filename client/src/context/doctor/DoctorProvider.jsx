import { useEffect, useState } from "react";
import DoctorContext from "./DoctorContext";
import { getAllDoctor } from "../../utils/network-data";
import { useAuth } from '../../hooks/useAuth.js'

function DoctorProvider({ children }) {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const { data } = await getAllDoctor();
      setDoctors(data);
    } catch (error) {
      console.error("Gagal ambil data dokter:", error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  useEffect(() => {
    if (user?.role === "user") {
      fetchDoctors();
    }
  }, [user]);

  return (
    <DoctorContext.Provider
      value={{
        doctors,
        loadingDoctors,
        fetchDoctors,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
}

export default DoctorProvider;