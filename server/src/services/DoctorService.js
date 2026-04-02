import { nanoid } from "nanoid";
import { Pool } from "pg";
import NotFoundError from '../exceptions/NotFoundError.js'

export default class DoctorService {
  constructor() {
    this._pool = new Pool();
  }

  async addDoctor({
    name,
    specialization,
    email,
    phone,
    hospital_name,
    hospital_address,
    experience_years,
    workday_start,
    workday_end,
    worktime_start,
    worktime_end
  }) {
    const id = `doctor-${nanoid(10)}`;
    const createdAt = new Date().toISOString();
    const updateAt = createdAt;

    const query = {
      text: 'INSERT INTO doctors values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
      values: [
        id,
        name,
        specialization,
        email,
        phone,
        hospital_name,
        hospital_address,
        experience_years,
        workday_start,
        workday_end,
        worktime_start,
        worktime_end,
        createdAt,
        updateAt
      ]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menambahkan dokter. Id tidak ditemukan');
    }

    return result.rows;
  }

  async getAllDoctor() {
    const result = await this._pool.query('Select * from doctors');

    return result.rows;
  }

  async getHistoryDoctors(id) {
    const query = {
      text: `select doctors.* 
              from doctors
              inner join collaborations on collaborations.doctor_id = doctors.id
            where collaborations.user_id = $1`,
      values: [id]
    };

    const result = await this._pool.query(query);

    return result ? result.rows : [];
  }

  async getDoctorById(id) {
    const result = await this._pool.query('select * from doctors where id = $1', [id]);

    return result ? result.rows : [];
  }

  async getContactDoctorById(id) {
    const query = {
      text: `
      select '' as "conversationId", usr.id as "accountId", usr.fullname, dr.specialization 
        from users as usr
          inner join doctors as dr on dr.id = usr.id
          where usr.id = $1
      `,
      values: [id]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal mengambil data contact dokter');
    }

    return result.rows;
  }

  async putDoctor(id, { name, specialization, email, phone, hospital_name, hospital_address, experience_years, workday_start, workday_end, worktime_start, worktime_end }) {
    const updateAt = new Date().toISOString();
    const query = {
      text: `UPDATE doctors
              SET 
              id = $1,
              name = $2,
              specialization = $3,
              email = $4,
              phone = $5,
              hospital_name = $6,
              hospital_address = $7,
              experience_years = $8,
              workday_start = $9,
              workday_end = $10,
              worktime_start = $11,
              worktime_end = $12,
              update_date = $13
              WHERE id = $1
              RETURNING id`,
      values: [id, name, specialization, email, phone, hospital_name, hospital_address, experience_years, workday_start, workday_end, worktime_start, worktime_end, updateAt]
    }

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui dokter. Id tidak ditemukan');
    }
  }

  async deleteDoctor(id) {
    const result = await this._pool.query('DELETE FROM doctors WHERE id = $1 RETURNING id', [id]);

    if (!result.rowCount) {
      throw new NotFoundError('Dokter tidak ditemukan');
    }
  }
}