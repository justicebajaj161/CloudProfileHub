-- CloudProfile Hub Database Schema
-- This file initializes the PostgreSQL database with required tables

-- Create users table with authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  bio TEXT,
  profile_picture_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create activity logs table for tracking user actions
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sessions table for managing user sessions (optional)
CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);

-- Insert sample data for development
INSERT INTO users (name, email, password, bio) VALUES 
(
  'John Doe', 
  'john@example.com', 
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj95.z6/PUeq', -- password: 'Password123!'
  'Full-stack developer passionate about cloud technologies and AWS'
),
(
  'Jane Smith', 
  'jane@example.com', 
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj95.z6/PUeq', -- password: 'Password123!'
  'DevOps engineer specializing in AWS, Docker, and Kubernetes'
),
(
  'Mike Johnson', 
  'mike@example.com', 
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj95.z6/PUeq', -- password: 'Password123!'
  'Cloud architect with expertise in serverless technologies'
)
ON CONFLICT (email) DO NOTHING;

-- Insert sample activity logs
INSERT INTO activity_logs (user_id, action, details) VALUES 
(1, 'USER_REGISTERED', '{"method": "email", "source": "web"}'),
(2, 'USER_REGISTERED', '{"method": "email", "source": "web"}'),
(3, 'USER_REGISTERED', '{"method": "email", "source": "web"}'),
(1, 'PROFILE_UPDATED', '{"fields": ["bio"], "timestamp": "2024-01-15T10:30:00Z"}'),
(2, 'USER_LOGIN', '{"timestamp": "2024-01-15T14:20:00Z", "ip": "192.168.1.1"}')
ON CONFLICT DO NOTHING;

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (if needed for specific user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'CloudProfile Hub database initialized successfully!';
    RAISE NOTICE 'Tables created: users, activity_logs, user_sessions';
    RAISE NOTICE 'Sample users created with password: Password123!';
END $$;