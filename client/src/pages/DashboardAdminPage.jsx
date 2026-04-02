import React, { useMemo, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Plus, Search, Users } from 'lucide-react';
import { useDoctor } from '../hooks/useDoctor.js';
import { usePagination } from '../hooks/setPages.js';
import { addDoctor, editDoctor, deleteDoctor } from '../utils/network-data.js';

import CompShowPopUpDoctor from '../components/AdminDashboard/CompShowPopUpDoctor.jsx';
import CompTableAdminDashboard from '../components/AdminDashboard/CompTableAdminDashboard.jsx';
import Pagination from '../components/Pagination.jsx';

const ITEMS_PER_PAGE = 10;
const MAX_VISIBLE_PAGES = 5;

function DashboardAdminPage() {
  const { doctors: getListDoctors } = useDoctor();
  const methods = useForm({
    defaultValues: {
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
      worktime_end: ''
    }
  });
  const [listDoctors, setListDoctors] = useState(getListDoctors);
  const [searchByInput, setSearchByInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopUp, setShowPopUp] = useState({
    id: '',
    type: '',
    show: false
  });
  const inputWorkDay = [
    { id: 1, desc: 'Senin' },
    { id: 2, desc: 'Selasa' },
    { id: 3, desc: 'Rabu' },
    { id: 4, desc: 'Kamis' },
    { id: 5, desc: 'Jumat' },
    { id: 6, desc: 'Sabut' },
    { id: 7, desc: 'Minggu' },
  ]

  const showListDoctor = useMemo(() => {
    if (searchByInput === '') {
      const sorted = listDoctors.sort((a, b) => {
        return new Date(b.join_date) - new Date(a.join_date);
      });
      return sorted;
    }

    const keyword = searchByInput.toLowerCase();
    const resultSearch = listDoctors.filter(record =>
      record.name.toLowerCase().includes(keyword) ||
      record.specialization.toLowerCase().includes(keyword) ||
      record.hospital_name.toLowerCase().includes(keyword)
    );

    const sorted = resultSearch.sort((a, b) => {
      return new Date(b.join_date) - new Date(a.join_date);
    });
    return sorted;
  }, [listDoctors, searchByInput]);

  const handlerSubmit = async (dataFormDoctor) => {
    const type = showPopUp.type;
    const parsedData = !type.includes('del') && {
      ...dataFormDoctor,
      experience_years: Number(dataFormDoctor.experience_years),
      workday_start: Number(dataFormDoctor.workday_start),
      workday_end: Number(dataFormDoctor.workday_end)
    };

    switch (type) {
      case 'post':
        {
          const { error, data } = await addDoctor(parsedData);
          if (!error) {
            const getList = [...listDoctors, ...data];
            const sorted = getList.sort((a, b) => {
              return new Date(b.join_date) - new Date(a.join_date);
            });
            setListDoctors(sorted);
          }
          break;
        }

      case 'put':
        {
          const idDoctor = showPopUp.id;
          const { error } = await editDoctor(idDoctor, parsedData);
          if (!error) {
            setListDoctors(prev =>
              prev.map(record => {
                if (record.id === idDoctor) {
                  return {
                    ...record,
                    ...parsedData
                  };
                }
                return record;
              })
            );
          }
          break;
        }

      default:
        {
          const idDoctor = showPopUp.id;
          const { error } = await deleteDoctor(idDoctor);
          if (!error) {
            setListDoctors(prev =>
              prev.filter(record => record.id !== idDoctor)
            );
          }
          break;
        }
    }

    setShowPopUp(prev => ({ ...prev, type: 'submit', show: false }));
  }

  const { resultPages: paginatedDoctors, totalPages } = usePagination(showListDoctor, ITEMS_PER_PAGE, currentPage);


  return (
    <div className='container-dashboard-admin-page'>
      <div className="header-wrapper-dashboard-admin">
        <div className="header-left-dashboard-admin">
          <h1>Manajemen Dokter</h1>
          <p>Kelola data dokter yang terdaftar</p>
        </div>
        <div className="header-right-dashboard-admin">
          <div className="content-header-right-dashboard-admin">
            <div className="icon-content-header-right-dashboard-admin">
              <Users />
            </div>
            <div className="info-content-header-right-dashboard-admin">
              <p className='total-list-doctor-dashboard-admin'>{showListDoctor.length}</p>
              <p className='desc-list-doctor-dashboard-admin'>Total Dokter</p>
            </div>
          </div>
        </div>
      </div>

      <div className="toolbar-wrapper-dashboard-admin">
        <div className="search-dashboard-admin">
          <Search />
          <input
            type="text"
            name="search"
            value={searchByInput}
            placeholder='Cari dokter berdasarkan nama, spesialisasi atau rumah sakit'
            onChange={(e) => {
              setSearchByInput(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <button onClick={() => setShowPopUp(prev => ({ ...prev, type: 'post', show: true }))}><Plus /> Tambah Dokter Baru</button>
      </div>

      <div className="table-wrapper-dashboard-admin">
        <CompTableAdminDashboard
          showListDoctor={paginatedDoctors}
          setShowPopUp={setShowPopUp}
          inputWorkDay={inputWorkDay}
        />
        <div className="position-pagination-list-doctors">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            maxVisiblePages={MAX_VISIBLE_PAGES}
          />
        </div>

      </div>


      {showPopUp.show && (
        <FormProvider {...methods}>
          <CompShowPopUpDoctor
            setShowPopUp={setShowPopUp}
            showPopUp={showPopUp}
            inputWorkDay={inputWorkDay}
            listDoctors={listDoctors}
            handlerSubmit={methods.handleSubmit(handlerSubmit)}
          />
        </FormProvider>
      )}
    </div>
  );
}

export default DashboardAdminPage;