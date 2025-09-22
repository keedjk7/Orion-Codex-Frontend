-- Initialize databases for Orion platform

-- Create Keycloak database
CREATE DATABASE keycloak;
GRANT ALL PRIVILEGES ON DATABASE keycloak TO orion_user;

-- Create Orion application database (already created as POSTGRES_DB)
-- Additional setup can be added here if needed

-- Create extensions if needed
\c orion;
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c keycloak;
-- Any Keycloak-specific setup can be added here
