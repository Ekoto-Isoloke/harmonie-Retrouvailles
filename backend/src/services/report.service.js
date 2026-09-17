const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType } = require('docx');

/**
 * Generate a PDF report from pointage rows and stream it to the response.
 * @param {Array} rows - Database rows of pointages.
 * @param {object} res - Express response.
 */
async function generatePdf(rows, res) {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    const date = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Disposition', `attachment; filename="rapport_pointage_${date}.pdf"`);
    doc.pipe(res);
    doc.fontSize(20).text('Rapport de Pointage', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    const headers = ['Nom', 'Prénom', "Heure d'arrivée", "Heure de départ", 'Statut'];
    const columnWidths = [100, 100, 100, 100, 80];
    headers.forEach((h, i) => {
        doc.text(h, { continued: i < headers.length - 1, width: columnWidths[i] });
    });
    doc.moveDown();
    rows.forEach(row => {
        const values = [row.nom || '', row.prenom || '', row.heure_arrivee || '', row.heure_depart || '', row.statut || ''];
        values.forEach((v, i) => {
            doc.text(v, { continued: i < values.length - 1, width: columnWidths[i] });
        });
        doc.moveDown();
    });
    doc.end();
}

/**
 * Generate a DOCX report from pointage rows and stream it to the response.
 * @param {Array} rows - Database rows of pointages.
 * @param {object} res - Express response.
 */
async function generateDocx(rows, res) {
    const tableRows = [];
    // Header row
    tableRows.push(new TableRow({
        children: [
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph('Nom')] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph('Prénom')] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("Heure d'arrivée")] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph('Heure de départ')] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph('Statut')] })
        ]
    }));
    rows.forEach(row => {
        tableRows.push(new TableRow({
            children: [
                new TableCell({ children: [new Paragraph(row.nom || '')] }),
                new TableCell({ children: [new Paragraph(row.prenom || '')] }),
                new TableCell({ children: [new Paragraph(row.heure_arrivee || '')] }),
                new TableCell({ children: [new Paragraph(row.heure_depart || '')] }),
                new TableCell({ children: [new Paragraph(row.statut || '')] })
            ]
        }));
    });
    const doc = new Document({
        sections: [{
            children: [
                new Paragraph({ children: [new TextRun({ text: 'Rapport de Pointage', bold: true, size: 32 })], alignment: 'center' }),
                new Paragraph({ text: '' }),
                new Table({ rows: tableRows, width: { size: 100, type: WidthType.PERCENTAGE } })
            ]
        }]
    });
    const buffer = await Packer.toBuffer(doc);
    const date = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="rapport_pointage_${date}.docx"`);
    res.send(buffer);
}

module.exports = { generatePdf, generateDocx };
