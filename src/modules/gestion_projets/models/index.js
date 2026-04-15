const { ProjetModel, STATUTS, TRANSITIONS, NIVEAU_MATURITE, FINANCEMENT } = require('./projets.model');
const MembreProjetModel = require('./MembreProjet.model');
const { DocumentProjetModel, TYPES_VALEURS } = require('./documentProjet.model');

module.exports = {
    ProjetModel,
    MembreProjetModel,
    DocumentProjetModel,
    //constantes utiles importées
    STATUTS,
    TRANSITIONS,
    NIVEAU_MATURITE,
    FINANCEMENT,
    TYPES_VALEURS
};