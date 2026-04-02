import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { getListContactFromHistoryConversation, getContactDoctorById, getAllMessages, updateMarkUnreadMessagesAsRead } from '../utils/network-data.js';
import { useWebSocket } from "../hooks/useWebSocket.js";
import { useAuth } from '../hooks/useAuth.js';

import CompContact from '../components/ContactAndMessage/CompContact.jsx';
import CompMessage from '../components/ContactAndMessage/CompMessage.jsx';

function MessagePage(props) {
  const { myUserId } = props;
  const { user: dataUserLogin } = useAuth();
  const { socket, onlineUsers } = useWebSocket();
  const methods = useForm({
    defaultValues: {
      sendMessage: ""
    }
  });
  const { id: idParams } = useParams();
  const [displayListContact, setDisplayListContact] = useState([]);
  const [selectIdContact, setSelectIdContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [allMessages, setAllMessages] = useState([]);

  // 🔥 LISTEN MESSAGE
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'update_conversation_id') {
        console.log("📩 Contact baru masuk:", data.updateConversationId);
        const finalSelectedContactId = selectIdContact ?? idParams;

        setDisplayListContact(prev => (
          prev.map(record =>
            record.accountId === finalSelectedContactId && record.conversationId === ''
              ? { ...record, conversationId: data.updateConversationId }
              : record)
        ));
      }

      if (data.type === "chat_message") {
        console.log("📩 Message masuk:", data.message);
        const finalSelectedContactId = selectIdContact ?? idParams;
        const getConversationId = displayListContact.find(record => record.accountId === finalSelectedContactId).conversationId;
        const isOpenMessage = data.message.conversation_id === getConversationId;

        if (isOpenMessage) {
          setMessages(prev => [...prev, data.message]);
        }
        setAllMessages(prev => [...prev, data.message]);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [displayListContact, idParams, selectIdContact, socket]);

  const fetchInitialMessages = useCallback(async (dataListContact) => {
    const { error, data: getInitialMessages } = await getAllMessages();
    if (!error) {
      setAllMessages(getInitialMessages);
      if (idParams) {
        const getConversationId = dataListContact.find(record => record.accountId === idParams)?.conversationId;
        const isExistMessage = getInitialMessages.filter(record => record.conversation_id === getConversationId);
        const showMessage = isExistMessage ?? [];
        setMessages(showMessage);
      }
    }
  }, [idParams]);

  const fetchInitialContactDoctorAndMessage = useCallback(async () => {
    let dataListContact = [];
    const throwRoleForListContact = dataUserLogin.role === 'user' ? 'doctor' : 'user';
    const { data: dataHistoryConversation } = await getListContactFromHistoryConversation(throwRoleForListContact);
    const isExistHistoryConversation = dataHistoryConversation.some(record => record.accountId === idParams);

    if (!isExistHistoryConversation) {
      const { data: getNewListDoctor } = await getContactDoctorById(idParams);
      dataListContact = [...dataHistoryConversation, ...getNewListDoctor];
      setDisplayListContact(dataListContact);
      await fetchInitialMessages(dataListContact);
      return;
    }

    dataListContact = [...dataHistoryConversation];
    setDisplayListContact(dataListContact);
    await fetchInitialMessages(dataListContact);
  }, [dataUserLogin, fetchInitialMessages, idParams]);


  useEffect(() => {
    async function fecthIsExistConversation() {
      await fetchInitialContactDoctorAndMessage();
    }

    fecthIsExistConversation();
  }, [idParams, fetchInitialContactDoctorAndMessage]);

  const fetchUpdateUnreadMessage = useCallback(async () => {
    const finalSelectedContactId = selectIdContact ?? idParams;
    const getConversationId = displayListContact.find(record => record.accountId === finalSelectedContactId)?.conversationId;
    const getSelectedUnreadMessage = allMessages.filter(record =>
      record.conversation_id === getConversationId &&
      record.account_id !== myUserId &&
      record.is_read === false
    );

    if (getSelectedUnreadMessage.length > 0) {
      const { error } = await updateMarkUnreadMessagesAsRead(getConversationId);

      if (!error) {
        // const updateAllMessage = allMessages.map(record => {
        //   const isUnread = getSelectedUnreadMessage.some(msgUnRead =>
        //     record.conversation_id === msgUnRead.conversation_id &&
        //     record.account_id === msgUnRead.account_id &&
        //     record.is_read === false
        //   );

        //   if (isUnread) {
        //     return { ...record, is_read: true };
        //   }

        //   return record;
        // });

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
  }, [allMessages, displayListContact, idParams, myUserId, selectIdContact]);

  useEffect(() => {

    async function fetchMessagesByConversation() {
      await fetchUpdateUnreadMessage();
      if (!selectIdContact) return;

      const finalSelectedContactId = selectIdContact ?? idParams;
      const getConversationId = displayListContact.find(record => record.accountId === finalSelectedContactId)?.conversationId;
      const showMessage = allMessages.filter(record => record.conversation_id === getConversationId);
      setMessages(showMessage);
    }

    fetchMessagesByConversation();
  }, [allMessages, displayListContact, fetchUpdateUnreadMessage, idParams, selectIdContact]);

  // Untuk jumlah unread message
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
  }

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

  // 🚀 SEND MESSAGE
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

    const finalSelectedContactId = selectIdContact ?? idParams;
    const finalConversationId = displayListContact.find(record => record.accountId === finalSelectedContactId).conversationId;

    // conversationId, accountId, text
    const payload = {
      senderRole: dataUserLogin.role,
      conversationId: finalConversationId,
      receiveId: finalSelectedContactId,
      text: message,
    };

    socket.send(JSON.stringify(payload));
    methods.setValue('sendMessage', '');
  };

  const displayHeaderMessage = useMemo(() => {
    const finalSelectedContactId = selectIdContact ?? idParams;
    const contactPerson = displayListContact.find(record => record.accountId === finalSelectedContactId);
    const headerConversationPerson = contactPerson ? { name: contactPerson.fullname, specialization: contactPerson.specialization } : null;

    return headerConversationPerson;
  }, [displayListContact, selectIdContact, idParams]);

  return (
    <div className='container-message-page'>
      <h1>Kontak Pesan</h1>
      <div className="contact-and-message">
        <section className='section-list-contact-doctor'>
          {displayListContact.map((ele, idx) => (
            <CompContact
              key={idx}
              ele={ele}
              setSelectIdContact={setSelectIdContact}
              selectIdContact={selectIdContact}
              idParams={idParams}
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

export default MessagePage;