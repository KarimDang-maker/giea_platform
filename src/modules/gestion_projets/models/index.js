const { ProjetModel,FINANCEMENT, NIVEAU_MATURITE, STATUTS } = require('./projets.model');
const { DocumentProjetModel, TYPES_AUTORISES } = require('./documentProjet.model');
const MembreProjetModel = require('./membreProjet.model');

module.exports = {
    ProjetModel,
    MembreProjetModel,
    DocumentProjetModel,
    //constantes utiles importées
    STATUTS,
    NIVEAU_MATURITE,
    FINANCEMENT,
    TYPES_AUTORISES
};