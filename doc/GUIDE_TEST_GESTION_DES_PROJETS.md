# Guide de Test - Module Gestion de Projets

Ce document détaille les procédures pour tester les fonctionnalités du module de gestion de projets.

## Configuration Générale

**URL de base** : `http://localhost:5000/api/projets` (à ajuster selon votre config serveur)
**Headers requis** :
- `Authorization`: `Bearer <VOTRE_TOKEN_JWT>`
- `Content-Type`: `application/json` (sauf pour l'upload de fichiers)

---

## 1. Création de Projet
**Endpoint** : `POST /creer-projet`
**Accès** : Entrepreneur / Admin

### Exemple de corps de requête (JSON) :
```json
{
  "nomPorteur": "Jean Entrepreneur",
  "titre": "Plateforme de Recyclage Innovante",
  "description": "Un projet visant à transformer les déchets plastiques en briques de construction abordables pour les zones rurales.",
  "secteur": "Environnement",
  "montantRecherche": 15000000,
  "financement": "investissement",
  "niveauMaturite": "prototype"
}
```

---

## 2. Consultation des Projets

### Lister mes projets (en tant qu'entrepreneur)
**Endpoint** : `GET /liste-projets`
**Accès** : Entrepreneur (renvoie uniquement ses propres projets)

### Détails d'un projet spécifique
**Endpoint** : `GET /mon-projet/:id`
**Accès** : Entrepreneur (Propriétaire) / Admin

---

## 3. Gestion de l'Équipe (Membres)
**Endpoint** : `POST /:id/membres`
**Accès** : Entrepreneur (Propriétaire) / Admin

### Exemple de corps de requête (JSON) :
```json
{
  "nom": "Alice Dupont",
  "role": "Directrice Technique"
}
```

### Retirer un membre
**Endpoint** : `DELETE /:id/membres/:membreId`
**Accès** : Entrepreneur (Propriétaire) / Admin

---

## 4. Gestion des Documents (Fichiers)
**Endpoint** : `POST /:id/documents`
**Accès** : Entrepreneur (Propriétaire) / Admin
**Content-Type** : `multipart/form-data`

### Paramètres (Body - form-data) :
| Clé | Type | Valeur |
| :--- | :--- | :--- |
| `fichier` | File | (Sélectionnez votre fichier .pdf ou .docx) |
| `type` | Text | `business_plan` ou `presentation` |
| `nomDoc` | Text | "Mon Business Plan V1" |

### Supprimer un document
**Endpoint** : `DELETE /:id/documents/:docId`

---

## 5. Administration (Modération)

### Lister TOUS les projets de la plateforme
**Endpoint** : `GET /admin/tous`
**Accès** : Admin uniquement

### Changer le statut d'un projet
**Endpoint** : `PATCH /:id/statut`
**Accès** : Admin uniquement

### Exemple de corps de requête (JSON) :
```json
{
  "statut": "en_evaluation",
  "suggestion": "Le montant recherché semble élevé pour la maturité actuelle. Merci de fournir plus de détails sur le ROI."
}
```
*Note : Les transitions sont contrôlées (ex: on ne peut pas passer de `soumis` directement à `bancable`).*

---

## 6. Mise à jour et Suppression

### Modifier les infos de base
**Endpoint** : `PUT /update-projet/:id`
**Accès** : Entrepreneur (Propriétaire) / Admin

### Supprimer un projet complet
**Endpoint** : `DELETE /supprime-projet/:id`
**Accès** : Entrepreneur (Propriétaire) / Admin
*Note : Cette action supprime également tous les fichiers associés dans Firebase Storage.*

---

## Codes de Statut Attendus
- `201 Created` : Création réussie.
- `200 OK` : Opération réussie.
- `400 Bad Request` : Erreur de validation (ex: titre trop court, transition de statut interdite).
- `401 Unauthorized` : Token manquant ou invalide.
- `403 Forbidden` : Vous tentez d'accéder à un projet qui ne vous appartient pas ou vous n'avez pas le rôle requis.
- `404 Not Found` : Projet inexistant.
```

### Pourquoi ce guide est important pour tes tests ?

1. **Vérification des Rôles** : Tu pourras tester qu'un utilisateur avec le rôle `entrepreneur` reçoit bien une erreur `403` s'il tente d'appeler `/admin/tous`.
2. **Vérification de la Propriété (IDOR)** : Tu pourras vérifier que l'Entrepreneur A ne peut pas supprimer un document du Projet B (même s'il connaît l'ID) grâce à ton middleware `estProprietaire`.
3. **Débogage des Dates** : En créant un projet, vérifie bien dans le retour JSON que `createdAt` est au format ISO (String) comme configuré dans ton modèle.

Ce fichier est maintenant prêt à être utilisé par toi ou toute autre personne souhaitant valider le module.

<!--
