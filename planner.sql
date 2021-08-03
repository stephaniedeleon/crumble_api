\echo 'Delete and recreate planner db?'
\prompt 'Return for yes or control-C to cancel > ' answer

DROP DATABASE planner;
CREATE DATABASE planner;
\connect planner

\i planner-schema.sql
-- \i life-tracker-seed.sql