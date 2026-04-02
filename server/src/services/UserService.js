import { nanoid } from "nanoid";
import { Pool } from "pg";
import bcrypt from 'bcrypt';
import InvariantError from '../exceptions/InvariantError.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import AuthenticationError from "../exceptions/AuthenticationError.js";

export default class UserService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ fullname, email, password, birthday, gender }) {
    // Check Email is Exist
    await this._pool.query('SELECT email FROM users WHERE email = $1', [email]) ?? (() => { throw new InvariantError('Gagal menambahkan user. EMail sudah digunakan mohon gunakan email lain') })();

    const id = `user-${nanoid(10)}`;
    const role = 'user';
    const createdAt = new Date().toISOString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: `INSERT INTO users VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      values: [id, fullname, email, hashedPassword, birthday, gender, createdAt, role]
    };

    const result = await this._pool.query(query);

    return result.rows[0].id ?? (() => { throw new InvariantError('User gagal ditambahkan') })();
  }

  async getLoggedUsers(id) {
    const result = await this._pool.query('SELECT * FROM users WHERE id = $1', [id]);

    return result.rows[0] ?? (() => { throw new NotFoundError('Pengguna tidak ditemukan') })();
  }

  async verifyUserCredential({ email, password }) {
    if (!email || !password) {
      throw new AuthenticationError('Email dan password wajib diisi');
    }

    const result = await this._pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rowCount === 0) {
      throw new AuthenticationError('Email belum terdaftar');
    }

    const { id, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Password salah');
    }

    return result.rows[0];
  }

  async verifyCredentialRole(idUserLogin) {
    const query = {
      text: 'select id, role from users where id = $1',
      values: [idUserLogin]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Id tidak ditemukan');
    }

    const isRole = result.rows[0].role;

    if (isRole !== 'admin') {
      throw new AuthenticationError('Role tidak sesuai, mohon dicheck kembali');
    }
  }
}