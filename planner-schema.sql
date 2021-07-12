CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    email       VARCHAR(70) NOT NULL,
    password    TEXT NOT NULL,
    first_name  VARCHAR(50) NOT NULL,
    last_name   VARCHAR(50) NOT NULL,
    is_admin    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE main_tabs (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL,
    name        VARCHAR(30) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE subtabs (
    id          SERIAL PRIMARY KEY,
    main_id     INTEGER,
    sub_id      INTEGER,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (main_id) REFERENCES main_tabs(id) ON DELETE CASCADE,
    FOREIGN KEY (sub_id) REFERENCES subtabs(id)
);

CREATE TABLE tasks (
    id              SERIAL PRIMARY KEY,
    sub_id          INTEGER NOT NULL,
    details         VARCHAR(40) NOT NULL,
    completed_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (sub_id) REFERENCES subtabs(id) ON DELETE CASCADE
);


CREATE TABLE notes (
    id          SERIAL PRIMARY KEY,
    sub_id      INTEGER NOT NULL,
    title       VARCHAR(20) NOT NULL,
    details     TEXT NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (sub_id) REFERENCES subtabs(id) ON DELETE CASCADE
);

CREATE TABLE calendar (
    id          SERIAL PRIMARY KEY,
    sub_id      INTEGER NOT NULL,
    event       VARCHAR(20) NOT NULL,
    date        TIMESTAMP NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (sub_id) REFERENCES subtabs(id) ON DELETE CASCADE
);