# État Actuel de l'Application - GIEA Platform

## 📌 Vue d'Ensemble
**GIEA Platform** est une plateforme multi-rôle conçue pour la gestion des activités du Groupement d'Intérêt Économique Africain. Elle est actuellement en phase de développement backend, avec un socle solide pour l'authentification et la gestion des utilisateurs.

## 🛠️ Pile Technique
- **Serveur** : Node.js avec Express.js (v5.x)
- **Base de données** : Firebase Firestore (NoSQL)
- **Stockage** : Firebase Storage (pour les avatars)
- **Authentification** : Passport.js (Local, Google, Facebook)
- **Sécurité** : JWT, Helmet.js, CORS, bcryptjs, Rate Limiting
- **Documentation API** : Swagger UI
- **Notifications** : Nodemailer (Email)

## ✅ Fonctionnalités Implémentées

### 🔑 Authentification
- Inscription avec validation d'email.
- Connexion sécurisée via JWT.
- Réinitialisation de mot de passe.
- Intégration OAuth (Google, Facebook).
- Gestion des sessions et déconnexion.

### 👤 Gestion des Utilisateurs
- Profil complet (Prénom, Nom, Bio, Entreprise, Localisation, etc.).
- Gestion des rôles (Étudiant, Entrepreneur, PME, Investisseur, Mentor, Admin).
- Téléchargement d'avatar vers Firebase Storage.
- Gestion des préférences et notifications.
- Recherche et découverte d'utilisateurs.
- Désactivation de compte.

### 🛡️ Sécurité & Infrastructure
- En-têtes de sécurité via Helmet.js.
- Protection CORS.
- Limitation du débit (Rate Limiting) sur les routes sensibles.
- Validation rigoureuse des entrées avec express-validator.
- Documentation API interactive sous `/api/docs`.

## 📂 Structure du Projet
- `src/config/` : Configuration base de données, passport, swagger.
- `src/modules/` : Modules métier (Authentification, Marketplace).
- `src/controllers/`, `src/routes/` : Logique de contrôle et points d'entrée API.
- `src/models/` : Modèles de données pour Firestore.
- `src/services/` : Services réutilisables (Email, Token).
- `doc/` : Documentation détaillée et guides de test.

## 🚀 Prochaines Étapes (Feuille de Route)
1. **Modules Métier** : Implémenter les modules de projets, d'investissements et de messagerie.
2. **Frontend** : Développer l'interface utilisateur (React/Vite recommandé).
3. **Tableau de Bord** : Créer l'interface d'administration pour la gestion globale.
4. **Optimisation** : Ajouter un système de notifications en temps réel (WebSockets).

---
*Dernière mise à jour : 10 Avril 2026*
