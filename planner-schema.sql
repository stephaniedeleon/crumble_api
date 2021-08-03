CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(70) NOT NULL,
    password        TEXT NOT NULL,
    first_name      VARCHAR(50) NOT NULL,
    last_name       VARCHAR(50) NOT NULL,
    is_admin        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE main_tabs (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL,
    name            VARCHAR(30) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY     (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE subtabs (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL,
    main_id         INTEGER DEFAULT NULL,
    sub_id          INTEGER DEFAULT NULL,
    name            VARCHAR(30) NOT NULL,
    -- priority        VARCHAR(10) DEFAULT NULL,
    -- date            TIMESTAMP DEFAULT NULL,
    completed       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY     (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY     (main_id) REFERENCES main_tabs(id) ON DELETE CASCADE,
    FOREIGN KEY     (sub_id) REFERENCES subtabs(id) ON DELETE CASCADE
);

CREATE TABLE tasks (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL,
    main_id         INTEGER DEFAULT NULL,
    sub_id          INTEGER DEFAULT NULL,
    details         VARCHAR(40) NOT NULL,
    priority        VARCHAR(10) DEFAULT NULL,
    date            TIMESTAMP DEFAULT NULL,
    completed       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY     (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY     (main_id) REFERENCES main_tabs(id) ON DELETE CASCADE,
    FOREIGN KEY     (sub_id) REFERENCES subtabs(id) ON DELETE CASCADE
);


CREATE TABLE notes (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL,
    main_id         INTEGER DEFAULT NULL,
    sub_id          INTEGER DEFAULT NULL,
    title           VARCHAR(20) NOT NULL,
    details         JSON NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY     (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY     (main_id) REFERENCES main_tabs(id) ON DELETE CASCADE,
    FOREIGN KEY     (sub_id) REFERENCES subtabs(id) ON DELETE CASCADE
);

CREATE TABLE calendar (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL,
    main_id         INTEGER DEFAULT NULL,
    sub_id          INTEGER DEFAULT NULL,
    task_id         INTEGER DEFAULT NULL,
    event_name      VARCHAR(20) NOT NULL,
    -- priority        VARCHAR(10) DEFAULT NULL,
    notes           TEXT DEFAULT NULL,
    date            TIMESTAMP NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY     (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY     (main_id) REFERENCES main_tabs(id) ON DELETE CASCADE,
    FOREIGN KEY     (sub_id) REFERENCES subtabs(id) ON DELETE CASCADE,
    FOREIGN KEY     (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);