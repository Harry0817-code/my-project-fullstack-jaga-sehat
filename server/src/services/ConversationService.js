import { nanoid } from "nanoid";
import { Pool } from "pg";
import InvariantError from "../exceptions/InvariantError.js";

export default class ConversationService {
  constructor() {
    this._pool = new Pool();
  }

  async checkConversation(userId, doctorId) {
    const query = {
      text: 'select id from conversations where user_id = $1 AND doctor_id = $2',
      values: [userId, doctorId]
    }

    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async saveConversation(userId, doctorId) {
    const isExistConversation = await this.checkConversation(userId, doctorId);

    if (isExistConversation) {
      return;
    }

    const id = `conversation-${nanoid(10)}`;

    const query = {
      text: 'INSERT INTO conversations VALUES($1, $2, $3, NOW()) RETURNING id',
      values: [id, userId, doctorId]
    }

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Pesan tidak berhasil diperbarui');
    }

    return result.rows[0].id;
  }

  async getListContactFromHistoryConversation(id, throwRoleForListContact) {
    const query = {
      text: `
        select 
          conv.id as "conversationId", 
          usr.id as "accountId", 
          usr.fullname, 
          CASE 
            WHEN usr.role = 'doctor' THEN dr.specialization
            ELSE NULL
          END as specialization
        from conversations as conv
          inner join users as usr on (usr.id = conv.doctor_id or usr.id = conv.user_id) and usr.role = $2
          inner join doctors as dr on dr.id = conv.doctor_id
            where conv.user_id = $1 or conv.doctor_id = $1
              order by conv.created_at;
      `,
      values: [id, throwRoleForListContact]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return [];
    }

    return result.rows;
  }

  async getHistoryConversationRoleDoctor(id) {
    const query = {
      text: `
        select usr.* 
          from conversations as conv
            inner join users as usr on usr.id = conv.user_id
            where conv.doctor_id = $1
      `,
      values: [id]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return [];
    }

    return result.rows;
  }
}