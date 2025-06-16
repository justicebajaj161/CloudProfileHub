const pool = require('../config/database');

class User {
  static async findAll() {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // Add password field to create method
static async create(userData) {
  const { name, email, bio, password } = userData;
  const query = `
    INSERT INTO users (name, email, bio, password) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *
  `;
  const result = await pool.query(query, [name, email, bio, password]);
  return result.rows[0];
}

  static async update(id, userData) {
    const { name, email, bio, profile_picture_url } = userData;
    const query = `
      UPDATE users 
      SET name = $1, email = $2, bio = $3, profile_picture_url = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 
      RETURNING *
    `;
    const result = await pool.query(query, [name, email, bio, profile_picture_url, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = User;