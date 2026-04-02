import { Pool } from "pg";
import InvariantError from '../exceptions/InvariantError.js';

export default class MessageService {
  constructor() {
    this._pool = new Pool();
  }

  // Untuk menyimpan pesan dari websocket
  async saveMessage(conversationId, accountId, text) {
    const query = {
      text: `INSERT INTO messages (conversation_id, account_id, message) 
        VALUES ($1, $2, $3) RETURNING *`,
      values: [conversationId, accountId, text],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Pesan tidak berhasil diperbarui');
    }

    const messageId = result.rows[0].id;
    return await this.getMessageById(messageId, accountId);
  };

  async getMessageById(messageId, accountId) {
    const query = {
      text: `
        select msg.* from messages as msg
          inner join conversations as conv on conv.id = msg.conversation_id
          inner join users as usr on usr.id = conv.user_id OR usr.id = conv.doctor_id
            where msg.id = $1 and usr.id = $2
      `,
      values: [messageId, accountId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }


  async getAllMessages(idLogin) {
    const query = {
      text: `
        select msg.* from messages as msg
          inner join conversations as conv on conv.id = msg.conversation_id
          inner join users as usr on usr.id = conv.user_id OR usr.id = conv.doctor_id
            where usr.id = $1
      `,
      values: [idLogin],
    };

    const result = await this._pool.query(query);
    return result.rows;
  };

  async putMarkUnreadMessagesAsReadname(conversationId) {
    const query = {
      text: `
        update messages 
          set is_read = true 
        where 
          conversation_id = $1 and is_read = false
        RETURNING *`,
      values: [conversationId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Pesan tidak berhasil diperbarui');
    }
  }
}