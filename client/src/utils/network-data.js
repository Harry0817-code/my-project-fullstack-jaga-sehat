const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* =========================
   TOKEN HELPERS
========================= */
function getAccessToken() {
  return localStorage.getItem('accessToken');
}

function putAccessToken(accessToken) {
  localStorage.setItem('accessToken', accessToken);
}

function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

function putRefreshToken(refreshToken) {
  localStorage.setItem('refreshToken', refreshToken);
}

function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

/* =========================
   REFRESH ACCESS TOKEN
========================= */
async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  const response = await fetch(`${BASE_URL}/authentications`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    throw new Error('Refresh token invalid');
  }

  putAccessToken(responseJson.data.accessToken);
  return responseJson.data.accessToken;
}

/* =========================
   FETCH WITH TOKEN (AUTO REFRESH)
========================= */
async function fetchWithToken(url, options = {}) {
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  // Access token expired
  if (response.status === 401) {
    try {
      await deleteRefreshToken(getRefreshToken()); // Hapus refreshToken dulu sebelum buat accessToken baru
      const newAccessToken = await refreshAccessToken();

      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    } catch (error) {
      clearTokens();
      window.location.href = '/login';
      throw error;
    }
  }

  return response;
}

async function deleteRefreshToken(token) {
  const response = await fetch(`${BASE_URL}/auth`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken: token }),
  });

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    alert(responseJson.message);
    return { error: true };
  }

  return { error: false };
}

/* =========================
   USER
========================= */
async function register({ fullname, email, password, birthday, gender }) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fullname, email, password, birthday, gender }),
  });

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    alert(responseJson.message);
    return { error: true };
  }

  return { error: false };
}

async function getUserLogged() {
  const response = await fetchWithToken(`${BASE_URL}/user/me`);
  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data };
}

/* =========================
   AUTH
========================= */
async function login(email, password) {
  const response = await fetch(`${BASE_URL}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    alert(responseJson.message);
    return { error: true, data: null };
  }

  // 🔥 SIMPAN TOKEN
  putAccessToken(responseJson.data.accessToken);
  putRefreshToken(responseJson.data.refreshToken);

  return { error: false, data: responseJson.data };
}

/* =========================
   Prompt Geimini AI
========================= */
async function addPromptGenAi(payload) {
  const response = await fetch(`${BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data };
}

/* =========================
   DOCTOR
========================= */
async function addDoctor(payload) {
  const response = await fetchWithToken(`${BASE_URL}/doctor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    alert(responseJson.message);
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data };
}

async function editDoctor(id, payload) {
  const response = await fetchWithToken(`${BASE_URL}/doctor/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    alert(responseJson.message);
    return { error: true };
  }

  return { error: false };
}

async function deleteDoctor(id) {
  const response = await fetchWithToken(`${BASE_URL}/doctor/${id}`, {
    method: 'DELETE',
  });

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    alert(responseJson.message);
    return { error: true };
  }

  return { error: false };
}

async function getAllDoctor() {
  const response = await fetch(`${BASE_URL}/doctor`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data };
}

async function getDoctorById(id) {
  const response = await fetch(`${BASE_URL}/doctor/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data };
}

/* =========================
   Message Page
========================= */
async function getListContactFromHistoryConversation(role) {
  const response = await fetchWithToken(`${BASE_URL}/history/conversation/${role}`);
  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data };
}

async function getContactDoctorById(id) {
  const response = await fetch(`${BASE_URL}/contact/doctor/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data };
}

async function getAllMessages() {
  const response = await fetchWithToken(`${BASE_URL}/messages`);
  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    return { error: true, data: null };
  }

  return { error: false, data: responseJson.data };
}

async function updateMarkUnreadMessagesAsRead(conversationId) {
  const response = await fetchWithToken(`${BASE_URL}/messages`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(conversationId),
  });

  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    alert(responseJson.message);
    return { error: true };
  }

  return { error: false };
}

export {
  register,
  getUserLogged,
  login,
  clearTokens,
  addPromptGenAi,
  addDoctor,
  editDoctor,
  deleteDoctor,
  getAllDoctor,
  getDoctorById,
  deleteRefreshToken,
  getRefreshToken,
  getAccessToken,
  getListContactFromHistoryConversation,
  getContactDoctorById,
  getAllMessages,
  updateMarkUnreadMessagesAsRead
};