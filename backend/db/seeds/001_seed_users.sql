INSERT INTO users (name, email, password, role, is_deleted, created_at, updated_at)
VALUES
('Admin User', 'admin@example.com', '$2y$10$uewnqJ5t25bUIpbakT32suVAgxsFs/NnkHTsL1YmOKxztOyry5Dh6', 'ADMIN', FALSE, NOW(), NOW()),
('User 01', 'user01@example.com', '$2y$10$uewnqJ5t25bUIpbakT32suVAgxsFs/NnkHTsL1YmOKxztOyry5Dh6', 'USER', FALSE, NOW(), NOW()),
('User 02', 'user02@example.com', '$2y$10$uewnqJ5t25bUIpbakT32suVAgxsFs/NnkHTsL1YmOKxztOyry5Dh6', 'USER', FALSE, NOW(), NOW()),
('User 03', 'user03@example.com', '$2y$10$uewnqJ5t25bUIpbakT32suVAgxsFs/NnkHTsL1YmOKxztOyry5Dh6', 'USER', FALSE, NOW(), NOW()),
('User 04', 'user04@example.com', '$2y$10$uewnqJ5t25bUIpbakT32suVAgxsFs/NnkHTsL1YmOKxztOyry5Dh6', 'USER', FALSE, NOW(), NOW()),
('User 05', 'user05@example.com', '$2y$10$uewnqJ5t25bUIpbakT32suVAgxsFs/NnkHTsL1YmOKxztOyry5Dh6', 'USER', FALSE, NOW(), NOW()),
('User 06', 'user06@example.com', '$2y$10$uewnqJ5t25bUIpbakT32suVAgxsFs/NnkHTsL1YmOKxztOyry5Dh6', 'USER', FALSE, NOW(), NOW()),
('User 07', 'user07@example.com', '$2y$10$uewnqJ5t25bUIpbakT32suVAgxsFs/NnkHTsL1YmOKxztOyry5Dh6', 'USER', FALSE, NOW(), NOW()),
('User 08', 'user08@example.com', '$2y$10$uewnqJ5t25bUIpbakT32suVAgxsFs/NnkHTsL1YmOKxztOyry5Dh6', 'USER', FALSE, NOW(), NOW()),
('User 09', 'user09@example.com', '$2y$10$uewnqJ5t25bUIpbakT32suVAgxsFs/NnkHTsL1YmOKxztOyry5Dh6', 'USER', FALSE, NOW(), NOW()),
('User 10', 'user10@example.com', '$2y$10$uewnqJ5t25bUIpbakT32suVAgxsFs/NnkHTsL1YmOKxztOyry5Dh6', 'USER', FALSE, NOW(), NOW());

INSERT INTO pets (user_id, name, type, sex, birth_date, is_deleted, created_at, updated_at)
VALUES
(2, 'ぱすた', 'フェレット', 'FEMALE', '2025-03-04', FALSE, NOW(), NOW());

-- user_settings INSERT
INSERT INTO user_settings (
    user_id,
    remind_days_before,
    remind_hour,
    is_email_enabled,
    created_at,
    updated_at
)
SELECT
    id,
    1,
    9,
    TRUE,
    NOW(),
    NOW()
FROM users
ON CONFLICT (user_id) DO NOTHING;

-- pet_events INSERT
INSERT INTO pet_events (
    user_id,
    pet_id,
    event_type,
    title,
    event_at,
    next_event_at,
    memo,
    image_key,
    remind_at,
    is_deleted,
    created_at,
    updated_at
)
SELECT
    p.user_id,
    p.id,
    'HOSPITAL',
    '病院',
    '2026-05-01 10:00:00',
    '2026-06-01 10:00:00',
    '健康診断の予定',
    '',
    '2026-04-30 09:00:00',
    FALSE,
    NOW(),
    NOW()
FROM pets p
WHERE p.user_id = 2
  AND p.name = 'ぱすた'
  AND NOT EXISTS (
      SELECT 1
      FROM pet_events e
      WHERE e.pet_id = p.id
        AND e.event_type = 'HOSPITAL'
        AND e.title = '病院'
        AND e.event_at = '2026-05-01 10:00:00'
  );