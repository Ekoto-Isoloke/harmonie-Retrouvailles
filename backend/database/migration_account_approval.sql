-- Migration: système de validation de comptes par l'admin
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS statut_compte VARCHAR(20) DEFAULT 'en_attente' CHECK (statut_compte IN ('en_attente', 'approuve', 'rejete'));

-- Les comptes existants sont automatiquement approuvés
UPDATE utilisateurs SET statut_compte = 'approuve' WHERE statut_compte IS NULL OR statut_compte = 'en_attente';

-- Index pour les requêtes admin
CREATE INDEX IF NOT EXISTS idx_utilisateurs_statut ON utilisateurs(statut_compte);
