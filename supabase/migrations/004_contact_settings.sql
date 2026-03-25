-- Storefront call / WhatsApp (admin-editable)

CREATE TABLE contact_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  phone_tel TEXT NOT NULL DEFAULT '',
  whatsapp_number TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO contact_settings (id, phone_tel, whatsapp_number)
SELECT 1, '', ''
WHERE NOT EXISTS (SELECT 1 FROM contact_settings WHERE id = 1);
