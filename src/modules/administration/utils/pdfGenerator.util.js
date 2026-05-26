const PDFDocument = require('pdfkit');

/**
 * Génère un document PDF à partir d'un tableau de logs d'administration
 * @param {Array} logs - Liste des instances de LogModel
 * @returns {Promise<Buffer>} Le fichier PDF sous forme de Buffer binaire
 */
const generateAdminLogsPDF = (logs) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // En-tête du document
    doc.fontSize(18).text('GIEA - Journal d\'Activité des Administrateurs', { align: 'center' });
    doc.moveDown(2);

    // Tableau : En-têtes de colonnes
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Date',            30,  doc.y, { width: 110 });
    doc.text('Administrateur', 140,  doc.y, { width: 110 });
    doc.text('Action',         250,  doc.y, { width: 120 });
    doc.text('Cible',          370,  doc.y, { width: 190 });

    doc.moveDown(0.5);
    doc.moveTo(30, doc.y).lineTo(565, doc.y).stroke();
    doc.moveDown(0.5);

    // Contenu du tableau
    doc.font('Helvetica').fontSize(9);
    logs.forEach(log => {
      const currentY = doc.y;

      const dateFormatee = log.createdAt
        ? log.createdAt.substring(0, 16).replace('T', ' ')
        : 'N/A';
      const nomAdmin   = log.adminName || 'Inconnu'; // ✅ adminName
      const cibleTexte = log.cible?.type
        ? `${log.cible.type} : ${log.cible.nom || log.cible.id}`
        : 'Aucune';

      doc.text(dateFormatee, 30,  currentY, { width: 100 });
      doc.text(nomAdmin,    140,  currentY, { width: 100 });
      doc.text(log.action,  250,  currentY, { width: 110, ellipsis: true }); // ✅ ellipsis
      doc.text(cibleTexte,  370,  currentY, { width: 190, ellipsis: true }); // ✅ ellipsis

      doc.moveDown(1);
    });

    doc.end();
  });
};

/**
 * Génère un document PDF à partir d'un tableau de logs utilisateurs
 * @param {Array} logs - Liste des instances de LogModel
 * @returns {Promise<Buffer>} Le fichier PDF sous forme de Buffer binaire
 */
const generateUserLogsPDF = (logs) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // En-tête
    doc.fontSize(18).text('GIEA - Journal d\'Activité des Utilisateurs', { align: 'center' });
    doc.moveDown(2);

    // Tableau : En-têtes de colonnes
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Date',        30,  doc.y, { width: 110 });
    doc.text('Utilisateur', 140, doc.y, { width: 110 });
    doc.text('Action',      250, doc.y, { width: 120 });
    doc.text('Cible',       370, doc.y, { width: 190 });

    doc.moveDown(0.5);
    doc.moveTo(30, doc.y).lineTo(565, doc.y).stroke();
    doc.moveDown(0.5);

    // Contenu du tableau
    doc.font('Helvetica').fontSize(9);
    logs.forEach(log => {
      const currentY = doc.y;

      const dateFormatee = log.createdAt
        ? log.createdAt.substring(0, 16).replace('T', ' ')
        : 'N/A';
      const nomUser    = log.userNom || 'Inconnu';
      const cibleTexte = log.cible?.type
        ? `${log.cible.type} : ${log.cible.nom || log.cible.id}`
        : 'Aucune';

      doc.text(dateFormatee, 30,  currentY, { width: 100 });
      doc.text(nomUser,      140, currentY, { width: 100 });
      doc.text(log.action,   250, currentY, { width: 110, ellipsis: true }); // ✅ ellipsis
      doc.text(cibleTexte,   370, currentY, { width: 190, ellipsis: true }); // ✅ ellipsis

      doc.moveDown(1);
    });

    doc.end();
  });
};

module.exports = {
  generateAdminLogsPDF,
  generateUserLogsPDF
};