const admin = require('firebase-admin'); 
const { ProjetModel } = require('../../gestion_projets/models/projets.model');

const COLLECTION_NAME = 'projets';

class AdminProjetRepo {
    constructor(){
        this.db = admin.firestore();
        this.collection = this.db.collection(COLLECTION_NAME);
    }

    async getProjetById(id) {
        if (!id) {
          throw new Error('ID du projet requis');
        }
    
        const projetDoc = await this.collection.doc(id).get();
        if (!projetDoc.exists) {
          throw new Error('Projet non trouvé');
        }
    
        return new ProjetModel({ id: projetDoc.id, ...projetDoc.data() });
      }

    async getAllProjets(filters = {}) {
        try {
          let queryRef = this.collection;
          const projetsTrouves = []; // Initialisation du tableau pour accumuler les résultats
    
          console.log('Filters reçus au repo:', filters);
    
          // 1. Filtre par statut de projets
          if (filters.statut) {
            queryRef = queryRef.where('statut', '==', filters.statut);
            console.log('[DEBUG] Filtre status appliqué:', filters.statut);
          }
    
          // 2. Filtre par secteur (Cible le sous-champ de l'objet dénormalisé)
          if (filters.secteur) {
            queryRef = queryRef.where('secteur.name', '==', filters.secteur);
            console.log('[DEBUG] Filtre secteur.name appliqué:', filters.secteur);
          }
    
          // 3. Filtre par statut de publication (Gestion sécurisée du type Boolean)
          if (filters.estPublie !== undefined && filters.estPublie !== '') {
            const boolPublie = filters.estPublie === 'true' || filters.estPublie === true;
            queryRef = queryRef.where('estPublie', '==', boolPublie);
            console.log('[DEBUG] Filtre estPublie appliqué:', boolPublie);
          }

          // 4. Filtre par date de création
          if (filters.date) {
            const { from, to } = this._buildDateRange(filters.date);
    
            // Note : Si tes dates en base sont stockées sous forme d'objets Timestamp Firebase,
            // passe directement les instances de Date (from et to) à Firestore.
            // Si elles sont stockées en chaînes ISO, utilise .toISOString()
            if (from) {
              queryRef = queryRef.where('createdAt', '>=', from);
            }
    
            if (to) {
              queryRef = queryRef.where('createdAt', '<=', to);
            }
            console.log('[DEBUG] Filtres de date appliqués');
          }
    
          // Limite de sécurité pour la pagination de l'interface admin
          const snapshot = await queryRef.limit(20).get();
          console.log('[DEBUG] Nombre de projets trouvés:', snapshot.size);
    
          // Parcourt le snapshot et remplit le tableau de résultats
          snapshot.forEach((doc) => {
            const data = doc.data();
            // On passe l'identifiant Firestore au constructeur pour avoir l'id complet
            const projet = new ProjetModel({ id: doc.id, ...data });
            projetsTrouves.push(projet);
          });
    
          return projetsTrouves; //Retourne le tableau complet de modèles
        } catch (error) {
          console.error('[DEBUG] Erreur dans getAllProjets:', error);
          
          // Aide au débogage pour les requêtes complexes Firestore
          if (error.message && error.message.includes('FAILED_PRECONDITION')) {
             console.warn('[WARN] Pense à cliquer sur le lien généré par Firestore dans les logs pour créer l\'index composite nécessaire.');
          }
          
          throw new Error(`Erreur lors de la récupération des projets : ${error.message}`);
        }
      }

    _buildDateRange(dateFilter) {
       let from = null;
       let to = null;

       if (typeof dateFilter === 'string' || dateFilter instanceof Date) {
           const exact = new Date(dateFilter);
           if (!isNaN(exact)) {
               exact.setHours(0, 0, 0, 0);
               from = exact;
               to = new Date(exact);
               to.setHours(23, 59, 59, 999);
           }
        } else if (typeof dateFilter === 'object' && dateFilter !== null) {
              if (dateFilter.exact) {
                   const exact = new Date(dateFilter.exact);
                   if (!isNaN(exact)) {
                       exact.setHours(0, 0, 0, 0);
                       from = exact;
                       to = new Date(exact);
                       to.setHours(23, 59, 59, 999);
                   }
               } else {
                   if (dateFilter.from) {
                       const f = new Date(dateFilter.from);
                       if (!isNaN(f)) from = f;
                   }
                   if (dateFilter.to) {
                       const t = new Date(dateFilter.to);
                       if (!isNaN(t)) to = t;
                    }
                }
            }

        return { from, to };
    }
}

module.exports = new AdminProjetRepo();