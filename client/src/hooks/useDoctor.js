import { useContext } from "react";
import DoctorContext from "../context/doctor/DoctorContext.js";

export function useDoctor() {
  const context = useContext(DoctorContext);

  if (!context) {
    throw new Error("useDoctor harus digunakan di dalam DoctorProvider");
  }

  return context;
}