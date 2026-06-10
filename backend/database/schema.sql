-- 1. Ecoles
CREATE TABLE ecoles (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL -- Primaire, Humanités
);

-- 2. Utilisateurs (RBAC)
CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    ecole_id INTEGER REFERENCES ecoles(id),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    role VARCHAR(50) NOT NULL, -- Super-Admin, Admin, Comptable, Enseignant, Agent, Parent, Eleve
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Classes
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    ecole_id INTEGER REFERENCES ecoles(id),
    nom VARCHAR(50) NOT NULL,
    niveau VARCHAR(50) NOT NULL
);

-- 4. Eleves
CREATE TABLE eleves (
    id SERIAL PRIMARY KEY,
    ecole_id INTEGER REFERENCES ecoles(id),
    classe_id INTEGER REFERENCES classes(id),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE
);

-- 5. Liaisons Parents-Eleves
CREATE TABLE liaisons_parents_eleves (
    parent_id INTEGER REFERENCES utilisateurs(id),
    eleve_id INTEGER REFERENCES eleves(id),
    PRIMARY KEY (parent_id, eleve_id)
);

-- 6. Pointages Personnel (Agents & Enseignants)
CREATE TYPE presence_statut AS ENUM ('Présent', 'En retard', 'Absent', 'En congé', 'En mission');
CREATE TYPE justification_statut AS ENUM ('Non requis', 'En attente', 'Justifié', 'Non justifié');

CREATE TABLE pointages_personnel (
    id SERIAL PRIMARY KEY,
    utilisateur_id INTEGER REFERENCES utilisateurs(id),
    date_pointage DATE DEFAULT CURRENT_DATE,
    heure_arrivee TIME,
    heure_depart TIME,
    minutes_retard INTEGER DEFAULT 0,
    statut presence_statut NOT NULL,
    motif TEXT,
    justification justification_statut DEFAULT 'Non requis',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(utilisateur_id, date_pointage)
);

-- 7. Frais Scolaires et Taux de Change
CREATE TABLE taux_change (
    id SERIAL PRIMARY KEY,
    devise_base VARCHAR(3) DEFAULT 'USD',
    devise_cible VARCHAR(3) DEFAULT 'CDF',
    taux DECIMAL(10,2) NOT NULL,
    date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE frais_scolaires (
    id SERIAL PRIMARY KEY,
    ecole_id INTEGER REFERENCES ecoles(id),
    classe_id INTEGER REFERENCES classes(id),
    nom_frais VARCHAR(100) NOT NULL,
    montant DECIMAL(10,2) NOT NULL,
    devise VARCHAR(3) DEFAULT 'USD'
);

-- 8. Paiements & Bordereaux
CREATE TABLE paiements (
    id SERIAL PRIMARY KEY,
    numero_transaction VARCHAR(50) UNIQUE NOT NULL,
    eleve_id INTEGER REFERENCES eleves(id),
    frais_scolaire_id INTEGER REFERENCES frais_scolaires(id),
    caissier_id INTEGER REFERENCES utilisateurs(id),
    montant_paye DECIMAL(10,2) NOT NULL,
    devise VARCHAR(3) NOT NULL,
    taux_applique DECIMAL(10,2),
    reste_a_payer DECIMAL(10,2) NOT NULL,
    date_paiement TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Actualites
CREATE TABLE actualites (
    id SERIAL PRIMARY KEY,
    ecole_id INTEGER REFERENCES ecoles(id), -- NULL si global
    auteur_id INTEGER REFERENCES utilisateurs(id),
    titre VARCHAR(255) NOT NULL,
    contenu TEXT NOT NULL,
    cible_role VARCHAR(50), -- Optionnel: pour cibler les parents, profs...
    date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
