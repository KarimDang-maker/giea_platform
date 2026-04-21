const upload = require('./upload.middleware');
const estProprietaire = require('./owner.middleware');

module.exports = {
    upload,
    estProprietaire
};