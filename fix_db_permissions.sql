-- Grant permissions to the database user extracted from your DATABASE_URL connection string
-- The user is 'postgres'

GRANT USAGE ON SCHEMA public TO "postgres";
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "postgres";
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO "postgres";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO "postgres";

-- Replace 'your_database_user' with the actual database user used in your connection string

GRANT USAGE ON SCHEMA public TO "postgres";
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "postgres";
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO "postgres";

-- To ensure future tables also have permissions granted automatically
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO "postgres";
