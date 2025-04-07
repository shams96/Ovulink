-- Database schema for Ovulink fertility tracking application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  gender VARCHAR(50) NOT NULL CHECK (gender IN ('male', 'female')),
  birth_date DATE,
  phone_number VARCHAR(20),
  height DECIMAL,
  weight DECIMAL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Partner links table
CREATE TABLE IF NOT EXISTS partner_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, partner_id)
);

-- Menstrual cycles table
CREATE TABLE IF NOT EXISTS menstrual_cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  flow VARCHAR(50) CHECK (flow IN ('light', 'medium', 'heavy')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Temperatures table
CREATE TABLE IF NOT EXISTS temperatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  value DECIMAL(3,1) NOT NULL CHECK (value BETWEEN 35.0 AND 42.0),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- Cervical mucus table
CREATE TABLE IF NOT EXISTS cervical_mucus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('dry', 'sticky', 'creamy', 'egg-white')),
  amount VARCHAR(50) NOT NULL CHECK (amount IN ('light', 'medium', 'abundant')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- Sperm health table
CREATE TABLE IF NOT EXISTS sperm_health (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  count INTEGER CHECK (count BETWEEN 0 AND 300),
  motility INTEGER CHECK (motility BETWEEN 0 AND 100),
  morphology INTEGER CHECK (morphology BETWEEN 0 AND 100),
  volume DECIMAL(3,1) CHECK (volume BETWEEN 0.0 AND 10.0),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  notes TEXT,
  reminder_time INTEGER,
  is_shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Intimacy logs table
CREATE TABLE IF NOT EXISTS intimacy_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME,
  is_protected BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Educational content table
CREATE TABLE IF NOT EXISTS educational_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags VARCHAR[] DEFAULT '{}',
  author VARCHAR(255),
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content interactions table
CREATE TABLE IF NOT EXISTS content_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES educational_content(id) ON DELETE CASCADE,
  interaction_type VARCHAR(50) NOT NULL CHECK (interaction_type IN ('view', 'bookmark', 'like')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, content_id, interaction_type)
);

-- Notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email BOOLEAN DEFAULT TRUE,
  push BOOLEAN DEFAULT TRUE,
  sms BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_partner_links_user_id ON partner_links(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_links_partner_id ON partner_links(partner_id);
CREATE INDEX IF NOT EXISTS idx_menstrual_cycles_user_id ON menstrual_cycles(user_id);
CREATE INDEX IF NOT EXISTS idx_menstrual_cycles_start_date ON menstrual_cycles(start_date);
CREATE INDEX IF NOT EXISTS idx_temperatures_user_id ON temperatures(user_id);
CREATE INDEX IF NOT EXISTS idx_temperatures_date ON temperatures(date);
CREATE INDEX IF NOT EXISTS idx_cervical_mucus_user_id ON cervical_mucus(user_id);
CREATE INDEX IF NOT EXISTS idx_cervical_mucus_date ON cervical_mucus(date);
CREATE INDEX IF NOT EXISTS idx_sperm_health_user_id ON sperm_health(user_id);
CREATE INDEX IF NOT EXISTS idx_sperm_health_date ON sperm_health(date);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_intimacy_logs_user_id ON intimacy_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_intimacy_logs_date ON intimacy_logs(date);
CREATE INDEX IF NOT EXISTS idx_educational_content_category ON educational_content(category);
CREATE INDEX IF NOT EXISTS idx_content_interactions_user_id ON content_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_content_interactions_content_id ON content_interactions(content_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at timestamp
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_links_updated_at
BEFORE UPDATE ON partner_links
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menstrual_cycles_updated_at
BEFORE UPDATE ON menstrual_cycles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_temperatures_updated_at
BEFORE UPDATE ON temperatures
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cervical_mucus_updated_at
BEFORE UPDATE ON cervical_mucus
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sperm_health_updated_at
BEFORE UPDATE ON sperm_health
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_educational_content_updated_at
BEFORE UPDATE ON educational_content
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
BEFORE UPDATE ON notification_preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
