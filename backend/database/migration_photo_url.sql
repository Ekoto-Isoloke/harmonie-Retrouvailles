-- Migration : Ajouter la colonne photo_url à la table etudiants
-- La colonne photo_url stocke la photo en base64 (data URL) de l'élève
-- Cette migration est idempotente (IF NOT EXISTS)

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'etudiants' AND column_name = 'photo_url'
  ) THEN
    ALTER TABLE etudiants ADD COLUMN photo_url TEXT;
  END IF;
END $$;
