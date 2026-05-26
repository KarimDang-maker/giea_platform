const { ProjetModel, FINANCEMENT, NIVEAU_MATURITE, STATUTS } = require('../../gestion_projets/models/projets.model');
const AdminProjetRepo = require('../repository/adminProjet.repository');

class AdminProjetService {
    async getUniqueProjet(id) {
        if (!id) {
          throw new Error('ID du projet requis');
        }
    
        return await AdminProjetRepo.getProjetById(id);
      }
    /**
       * Retourne la liste des projets pour l'admin selon les filtres fournis.
    */
    async getAllProjets(filters = {}) {
        return AdminProjetRepo.getAllProjets(filters);
    }
}

module.exports = new AdminProjetService();