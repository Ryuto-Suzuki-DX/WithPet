-- ユーザー
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ペット
CREATE UNIQUE INDEX IF NOT EXISTS users_email_active_unique
ON users (email)
WHERE is_deleted = FALSE;

CREATE TABLE IF NOT EXISTS pets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    sex VARCHAR(20) NOT NULL DEFAULT 'UNKNOWN',
    birth_date TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT fk_pets_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_settings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    remind_days_before INTEGER NOT NULL DEFAULT 1,
    remind_hour INTEGER NOT NULL DEFAULT 9,
    is_email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_settings_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ペットイベント明細
CREATE TABLE IF NOT EXISTS pet_event_items (
    id BIGSERIAL PRIMARY KEY,
    pet_event_id BIGINT NOT NULL,

    item_name VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    unit VARCHAR(10) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pet_event_items_event
        FOREIGN KEY (pet_event_id)
        REFERENCES pet_events(id)
        ON DELETE CASCADE
);

-- ペットイベント
CREATE TABLE IF NOT EXISTS pet_events (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    pet_id BIGINT NOT NULL,

    event_type VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,

    event_at TIMESTAMP NOT NULL,
    next_event_at TIMESTAMP,

    memo TEXT,
    image_key TEXT,

    remind_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    remind_at TIMESTAMP,
    remind_sent_at TIMESTAMP,  -- リマインド送信時間

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT fk_pet_events_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pet_events_pet
        FOREIGN KEY (pet_id)
        REFERENCES pets(id)
        ON DELETE CASCADE
);

-- ケアテンプレート
CREATE TABLE IF NOT EXISTS care_templates (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    pet_id BIGINT NOT NULL,

    template_type VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    image_key TEXT,

    is_fixed BOOLEAN NOT NULL DEFAULT FALSE,
    fixed_days_of_week TEXT,
    fixed_time TIME,

    memo TEXT,

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT fk_care_templates_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_care_templates_pet
        FOREIGN KEY (pet_id)
        REFERENCES pets(id)
        ON DELETE CASCADE
);

-- ケアテンプレート明細
CREATE TABLE IF NOT EXISTS care_template_items (
    id BIGSERIAL PRIMARY KEY,
    template_id BIGINT NOT NULL,

    item_name VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    unit VARCHAR(10) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_care_template_items_template
        FOREIGN KEY (template_id)
        REFERENCES care_templates(id)
        ON DELETE CASCADE
);