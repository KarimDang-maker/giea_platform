# Module Notifications - GIEA Platform

Ce module gère le système de notifications internes (sauvegardées en base de données) et externes (envois d'emails) de l'application. 
Il a été conçu de manière asynchrone pour ne pas ralentir le flux principal de l'API (ex: inscription utilisateur) en s'appuyant sur un système de file d'attente (Queue) robuste.

## Architecture & Flux de traitement

L'architecture s'appuie sur **BullMQ** (gestionnaire de queue) et **Redis** (base de données en mémoire).

1. **Déclenchement (Émetteur)** : Une action se produit dans l'application (ex: `authService.register`). Le contrôleur appelle le middleware `notify(userId)`.
2. **Formatage (`notify.js`)** : Le middleware récupère les données nécessaires (ex: prénom, nom) et crée un objet `NotificationEvent`. Il l'ajoute ensuite à la queue BullMQ sans utiliser `await` pour rendre l'action non-bloquante pour l'utilisateur.
3. **Mise en file d'attente (Redis)** : L'événement est stocké temporairement et de manière sécurisée dans Redis.
4. **Traitement (`worker.service.js`)** : Le *Worker* écoute la queue en arrière-plan. Dès qu'un job arrive, il le traite :
   - Il sauvegarde la notification en base (Firestore) via `notification.service.js`.
   - Il formatte et envoie l'email via `email.service.js` si la catégorie est "email".
5. **Envoi Email (`email.service.js`)** : Un *switch case* génère un template HTML spécifique en fonction du type de notification.

---

## ⚠️ Prérequis : Le Serveur Redis

**BullMQ** a impérativement besoin d'une instance **Redis** pour fonctionner. Sans Redis, les notifications ne pourront pas être mises en file d'attente et l'application affichera des erreurs de type `ECONNREFUSED 127.0.0.1:6379`.

### Solution Recommandée : Conteneurisation (Docker)

Au lieu d'installer Redis directement sur votre machine locale ou sur le serveur hôte (ce qui peut polluer votre système et créer des conflits de versions), il est **fortement recommandé d'utiliser Docker**.

**Pourquoi Docker ?**
- **Isolation** : Redis tourne dans un environnement isolé sans toucher aux paquets de votre machine.
- **Portabilité** : Une simple ligne de commande suffit à le faire tourner sur n'importe quel ordinateur ou serveur.
- **Propreté** : Vous pouvez le supprimer ou le stopper instantanément une fois le développement terminé.

**Commande pour lancer Redis via Docker :**
\`\`\`bash
docker run -d --name giea-redis -p 6379:6379 redis:alpine
\`\`\`
*Cette commande télécharge une image Redis très légère (alpine), la lance en arrière-plan (`-d`) et expose le port standard `6379` sur votre machine locale.*

Pour l'arrêter plus tard :
\`\`\`bash
docker stop giea-redis
\`\`\`

### Alternative : Installation Native
Si vous ne pouvez pas utiliser Docker, vous pouvez l'installer nativement :
- **Linux (Ubuntu/Debian)** : `sudo apt install redis-server && sudo systemctl start redis`
- **MacOS** : `brew install redis && brew services start redis`

---

## Configuration (.env)

Assurez-vous que les variables suivantes sont présentes dans votre fichier `.env` :

\`\`\`env
# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Nodemailer Configuration
NODE_MAILER_EMAIL=votre.email@gmail.com
NODE_MAILER_PASSWORD=votre_mot_de_passe_application
EMAIL_SERVICE=gmail
EMAIL_FROM="GIEA Platform" <noreply@giea.com>
\`\`\`

---

## Comment ajouter un nouveau type de notification ?

Si vous souhaitez créer un nouveau type de notification (ex: `NEW_MESSAGE`) :

1. **Mettre à jour le modèle** (`models/notification.model.js`) :
   Ajoutez votre nouvelle constante dans l'objet `NotificationType`.
   \`\`\`javascript
   const NotificationType = Object.freeze({
       // ... autres types
       NEW_MESSAGE: "NEW_MESSAGE"
   });
   \`\`\`

2. **Mettre à jour le Worker** (`services/worker.service.js`) :
   Ajoutez un `case` dans le switch pour définir comment le système doit réagir et quel titre/message appliquer en base de données.

3. **Mettre à jour le template d'Email** (`services/email.service.js`) :
   Si cet événement doit envoyer un email spécifique, ajoutez un `case` dans le switch pour formater l'HTML de l'email de manière personnalisée.

4. **Déclencher la notification** :
   Dans n'importe quel contrôleur, vous pourrez construire votre objet `NotificationEvent` et l'ajouter à la queue via `notificationQueue.add()`.
