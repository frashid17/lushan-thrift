-- Social profile URLs (footer + admin Contact page)

ALTER TABLE contact_settings ADD COLUMN IF NOT EXISTS instagram_url TEXT NOT NULL DEFAULT '';
ALTER TABLE contact_settings ADD COLUMN IF NOT EXISTS facebook_url TEXT NOT NULL DEFAULT '';
ALTER TABLE contact_settings ADD COLUMN IF NOT EXISTS tiktok_url TEXT NOT NULL DEFAULT '';
