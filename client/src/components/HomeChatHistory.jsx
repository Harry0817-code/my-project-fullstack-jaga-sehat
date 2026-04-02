import React, { useEffect, useMemo, useState } from 'react';
import { MessageCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePagination } from '../hooks/setPages.js';
import Pagination from './Pagination.jsx';
import { useWebSocket } from '../hooks/useWebSocket.js';
import { useAuth } from '../hooks/useAuth.js';
import { getListContactFromHistoryConversation, getAllMessages } from '../utils/network-data.js';


const ITEMS_PER_PAGE = 3;
const MAX_VISIBLE_PAGES = 5;

function HomeChatHistory() {
  const { onlineUsers: listConnectionDoctor } = useWebSocket();
  const { user: dataUserLogin } = useAuth();

  const [getListHistoryChatDoctors, setgetListHistoryChatDoctors] = useState([]);
  const [getListMessages, setGetListMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchInitialListHistoryChatDoctor() {
      const { data: getListHistoryNameDoctor } = await getListContactFromHistoryConversation('doctor');
      setgetListHistoryChatDoctors(getListHistoryNameDoctor);

      const { error, data: getInitialMessages } = await getAllMessages();
      if (!error) setGetListMessages(getInitialMessages);
    }

    fetchInitialListHistoryChatDoctor();
  }, [])

  const showHistoryChatDoctor = useMemo(() => {
    return getListHistoryChatDoctors;
  }, [getListHistoryChatDoctors]);

  const { resultPages: paginatedDoctors, totalPages } = usePagination(showHistoryChatDoctor, ITEMS_PER_PAGE, currentPage);

  // Untuk format waktu terakhir kapan diterima dan dikirim
  const timeAgo = (idContactPerson) => {
    const getConversationId = paginatedDoctors.find(record => record.accountId === idContactPerson).conversationId;
    const filterMessage = getListMessages.filter(record => record.conversation_id === getConversationId);

    if (filterMessage.length === 0) {
      return;
    }

    const lastMessageAt = filterMessage[filterMessage.length - 1].created_at;

    const now = new Date();
    const past = new Date(lastMessageAt);

    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "baru saja";
    if (diffMin < 60) return `${diffMin} menit lalu`;
    if (diffHour < 24) return `${diffHour} jam lalu`;
    if (diffDay < 7) return `${diffDay} hari lalu`;

    return past.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const lastMessage = (doctorId) => {
    const getConversationId = paginatedDoctors.find(record => record.accountId === doctorId).conversationId;
    const filterMessage = getListMessages.filter(record => record.conversation_id === getConversationId);

    if (filterMessage.length === 0) {
      return;
    }

    const lastMessage = filterMessage[filterMessage.length - 1].message;
    const getAccountId = filterMessage[filterMessage.length - 1].account_id;
    const showLastMessage = getAccountId === dataUserLogin.id ? `you: ${lastMessage}` : `reply: ${lastMessage}`;

    return showLastMessage;
  }

  const checkIsOnline = (doctorId) => {
    const isOnline = listConnectionDoctor.some(record => record.id === doctorId);

    return isOnline;
  }


  return (
    <section className='chat-history-section'>
      <div className="section-header">
        <h2>Riwayat Percakapan</h2>
        <p>Lihat riwayat konsultasi Anda dengan dokter</p>
      </div>

      <div className="section-list-history">
        {paginatedDoctors.map(listChatHistory => (
          <div className="card-chat-history" key={listChatHistory.accountId} onClick={() => navigate(`/message/${listChatHistory.accountId}`)}>
            <div className="chat-history-header">
              <div className="chat-history-header-icon-and-name">
                <div className="icon-doctor-chat-history">
                  <User />
                </div>
                <div className="name-specialization-chat-history-doctors">
                  <h3>{listChatHistory?.fullname}</h3>
                  <p>{listChatHistory?.specialization}</p>
                </div>
              </div>
              <div className="flag-connection-chat-history"
                style={{
                  color: checkIsOnline(listChatHistory.accountId) ? 'white' : '#304550',
                  background: checkIsOnline(listChatHistory.accountId) ? '#1dafa1' : '#f2f8f8'
                }}>
                {checkIsOnline(listChatHistory.accountId) ? 'Online' : 'Offline'}
              </div>
            </div>

            <div className="chat-history-last-message-time">
              <div className="last-message">
                <MessageCircle />
                <p>{lastMessage(listChatHistory.accountId)}</p>
              </div>
              <p>{timeAgo(listChatHistory.accountId)}</p>
            </div>

          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        maxVisiblePages={MAX_VISIBLE_PAGES}
      />
    </section>
  );
}

export default HomeChatHistory;