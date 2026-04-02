import React from 'react';

function CompContact(props) {
  const { 
    lastMessage, 
    ele, 
    setSelectIdContact, 
    selectIdContact, 
    idParams = null,
    timeAgo,
    countUnreadMessage, 
    onlineUsers 
  } = props;

  const finalSelectedContactId = selectIdContact ?? idParams;

  const checkIsOnline = (idContactPerson) => {
    const isOnline = onlineUsers.some(record => record.id === idContactPerson);

    return isOnline;
  }

  return (
    <div className='card-contact-person-doctor'
      style={{
        background: finalSelectedContactId === ele.accountId ? 'rgb(222 247 244 / 72%)' : 'white',
        border: finalSelectedContactId === ele.accountId && '1px solid hsl(174 60% 40%)',
        borderRadius: finalSelectedContactId === ele.accountId && '20px'
      }}
      onClick={() => setSelectIdContact(ele.accountId)}
    >
      <div className="background-img-contact-person">
        <img src="https://img.icons8.com/color/96/doctor-male.png" alt={ele.fullname} />
      </div>
      <div className="name-and-connected-contact-doctor" style={{ flexDirection: 'column', padding: '5px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="name-and-specialization">
            <p className='name-contact-person' style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              {ele.fullname}
              <span
                style={{
                  backgroundColor: checkIsOnline(ele.accountId) ? '#38e038' : 'grey',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                }}
              ></span>
            </p>
            <p className='specialization-contact-person'>{ele.specialization}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', width: '105px' }}>
            <p style={{ fontSize: '.875rem', lineHeight: '1.25rem' }}>{timeAgo(ele.accountId)}</p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'start' }}>
          <p className='last-message-contact-person'>{lastMessage(ele.accountId)}</p>
          <div className={countUnreadMessage(ele.accountId) > 0 ? 'background-count-unread-message' : undefined}>
            <span style={{ fontSize: '.875rem', lineHeight: '1.25rem' }}>{countUnreadMessage(ele.accountId)}</span>
          </div>
        </div>
        {/* <div className="connected-for-contact-person"
          style={{ color: connected(ele.accountId) === 'Online' ? 'white' : '#304550', background: connected(ele.accountId) === 'Online' ? '#1dafa1' : '#f2f8f8' }}>
          {connected(ele.accountId)}
        </div> */}
      </div>
    </div>
  );
}

export default CompContact;