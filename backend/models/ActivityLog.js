const pool = require('../config/database');

class ActivityLog {
  static async create(logData) {
    const { user_id, action, details } = logData;
    const query = `
      INSERT INTO activity_logs (user_id, action, details) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const result = await pool.query(query, [user_id, action, JSON.stringify(details)]);
    return result.rows[0];
  }

  static async findByUserId(userId, limit = 10) {
    const query = `
      SELECT * FROM activity_logs 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `;
    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }

  static async findAll(limit = 50) {
    const query = `
      SELECT al.*, u.name as user_name, u.email as user_email
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC 
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }
}

module.exports = ActivityLog;