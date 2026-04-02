import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { useWebSocket } from '../hooks/useWebSocket';
import { getListContactFromHistoryConversation, getAllMessages, updateMarkUnreadMessagesAsRead } from '../utils/network-data';
import CompContact from '../components/ContactAndMessage/CompContact';
import CompMessage from '../components/ContactAndMessage/CompMessage';

function DashboardDoctorPage() {
  const { user: dataUserLogin } = useAuth();
  const myUserId = dataUserLogin.id;
  const methods = useForm({
    defaultValues: {
      sendMessage: ""
    }
  });
  const { socket, onlineUsers } = useWebSocket();
  const [displayListContact, setDisplayListContact] = useState([]);
  const [selectIdContact, setSelectIdContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [allMessages, setAllMessages] = useState([]);

  const stored = dataUserLogin?.fullname;
  const userName = stored === null || stored === undefined ? "Pengunjung" : stored;

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'new_contact') {
        console.log("📩 Contact baru masuk:", data.contact);
        setDisplayListContact(data.contact);
      }

      if (data.type === "chat_message") {
        console.log("📩 Message masuk:", data.message);
        // setMessages(prev => [...prev, data.message]);
        setAllMessages(prev => [...prev, data.message]);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  const fetchInitialMessages = useCallback(async () => {
    const { error, data: getInitialMessages } = await getAllMessages();
    if (!error) {
      setAllMessages(getInitialMessages);
    }
  }, []);

  const fetchInitialContactDoctorAndMessage = useCallback(async () => {
    const throwRoleForListContact = dataUserLogin.role === 'user' ? 'doctor' : 'user';
    const { data: dataListContact } = await getListContactFromHistoryConversation(throwRoleForListContact);

    setDisplayListContact(dataListContact);
    await fetchInitialMessages();
  }, [dataUserLogin.role, fetchInitialMessages]);


  useEffect(() => {
    async function fecthIsExistConversation() {
      await fetchInitialContactDoctorAndMessage();
    }

    fecthIsExistConversation();
  }, [fetchInitialContactDoctorAndMessage]);

  const fetchUpdateUnreadMessage = useCallback(async () => {
    const getConversationId = displayListContact.find(record => record.accountId === selectIdContact).conversationId;
    const getSelectedUnreadMessage = allMessages.filter(record =>
      record.conversation_id === getConversationId &&
      record.account_id !== myUserId &&
      record.is_read === false
    );

    if (getSelectedUnreadMessage.length > 0) {
      const { error } = await updateMarkUnreadMessagesAsRead(getConversationId);

      if (!error) {
        setAllMessages(prev =>
          prev.map(record => {
            const isUnread = getSelectedUnreadMessage.some(msgUnRead =>
              record.conversation_id === msgUnRead.conversation_id &&
              record.account_id === msgUnRead.account_id &&
              record.is_read === false
            );

            if (isUnread) {
              return { ...record, is_read: true };
            }

            return record;
          })
        );
      }
    }
  }, [allMessages, displayListContact, myUserId, selectIdContact]);

  useEffect(() => {
    if (!selectIdContact) return;

    async function fetchMessagesByConversation() {
      await fetchUpdateUnreadMessage();

      const getConversationId = displayListContact.find(record => record.accountId === selectIdContact)?.conversationId;
      const showMessage = allMessages.filter(record => record.conversation_id === getConversationId);
      setMessages(showMessage);
    }

    fetchMessagesByConversation();
  }, [selectIdContact, allMessages, displayListContact, fetchUpdateUnreadMessage]);

  const countUnreadMessage = (idContactPerson) => {
    const getConversationId = displayListContact.find(record => record.accountId === idContactPerson)?.conversationId;
    const filterUnreadMessage = allMessages.filter(record =>
      record.conversation_id === getConversationId &&
      record.account_id !== myUserId &&
      record.is_read === false
    );

    if (filterUnreadMessage.length === 0) {
      return;
    }

    return filterUnreadMessage.length;
  }

  // Untuk menampilkan pesan terakhir di pesan kontak
  const lastMessage = (idContactPerson) => {
    const getConversationId = displayListContact.find(record => record.accountId === idContactPerson).conversationId;
    const filterMessage = allMessages.filter(record => record.conversation_id === getConversationId);

    if (filterMessage.length === 0) {
      return;
    }

    const lastMessage = filterMessage[filterMessage.length - 1].message;
    const getAccountId = filterMessage[filterMessage.length - 1].account_id;
    const showLastMessage = getAccountId === myUserId ? `you: ${lastMessage}` : `reply: ${lastMessage}`;

    return showLastMessage;
  };

  // Untuk format waktu terakhir kapan diterima dan dikirim
  const timeAgo = (idContactPerson) => {
    const getConversationId = displayListContact.find(record => record.accountId === idContactPerson).conversationId;
    const filterMessage = allMessages.filter(record => record.conversation_id === getConversationId);

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

  const handlerSendMessage = (messageFromSender) => {
    const message = messageFromSender.sendMessage;
    if (!socket) {
      console.log("Socket belum connect");
      return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
      console.log("Socket belum ready");
      return;
    }
    const finalConversationId = displayListContact.find(record => record.accountId === selectIdContact).conversationId;

    const payload = {
      conversationId: finalConversationId,
      receiveId: selectIdContact,
      text: message,
    };

    socket.send(JSON.stringify(payload));
    methods.setValue('sendMessage', '');
  };

  const displayHeaderMessage = useMemo(() => {
    const contactPerson = displayListContact.find(record => record.accountId === selectIdContact);
    const headerConversationPerson = contactPerson ? { name: contactPerson.fullname, specialization: contactPerson.specialization } : null;

    return headerConversationPerson;
  }, [displayListContact, selectIdContact]);

  return (
    <div className='container-dashboard-doctor'>
      <div className="header-dashboard-doctor">
        <h1>Dashboard Dokter</h1>
        <p>Selamat datang, {userName}. Kelola percakapan dengan pasien Anda.</p>
      </div>
      <div className="contact-and-message">
        <section className='section-list-contact-doctor'>
          {displayListContact.map((ele, idx) => (
            <CompContact
              key={idx}
              ele={ele}
              setSelectIdContact={setSelectIdContact}
              selectIdContact={selectIdContact}
              onlineUsers={onlineUsers}
              lastMessage={lastMessage}
              timeAgo={timeAgo}
              countUnreadMessage={countUnreadMessage}
            />
          ))}
        </section>

        <section className='section-receive-send-message'>
          {displayHeaderMessage === "" || displayHeaderMessage === null ? (
            <p>Klik kontak pesan untuk memulai percakapan</p>
          ) : (
            <FormProvider {...methods}>
              <CompMessage
                myUserId={myUserId}
                displayHeaderMessage={displayHeaderMessage}
                messages={messages}
                handlerSendMessage={methods.handleSubmit(handlerSendMessage)}
              />
            </FormProvider>
          )}
        </section>
      </div>
    </div>
  );
}

export default DashboardDoctorPage;