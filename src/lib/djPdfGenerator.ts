import { jsPDF } from 'jspdf';
import { SongRequest, WeddingProject } from '../types/wedding';

/**
 * Generates an ultra-luxurious, printable PDF for the Wedding DJ with all guest-submitted songs.
 */
export function exportDjPlaylistPdf(project: WeddingProject, songs: SongRequest[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background Royal Theme Frame
  doc.setFillColor(244, 239, 230); // Cream luxury parchment
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Gold Border Frame
  doc.setDrawColor(212, 175, 55); // 24K Gold
  doc.setLineWidth(1.5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  doc.setLineWidth(0.4);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Top Header Banner
  doc.setFillColor(28, 38, 25); // Deep Royal Olive
  doc.rect(13, 13, pageWidth - 26, 32, 'F');

  doc.setTextColor(243, 229, 171); // Pale Gold
  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.text('OFFICIAL WEDDING SANGEET & DJ PLAYLIST', pageWidth / 2, 24, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('times', 'italic');
  doc.text(`${project.partner1} & ${project.partner2}`, pageWidth / 2, 31, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(205, 219, 201);
  doc.text(`${project.venue.name}, ${project.venue.city} • Total Crowd Anthems: ${songs.length}`, pageWidth / 2, 38, { align: 'center' });

  // Instructions for DJ
  doc.setTextColor(45, 58, 41);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('SPECIAL INSTRUCTIONS FOR THE SANGEET & AFTERPARTY DJ:', 18, 54);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('• The tracks below have been requested directly by VIP guests & wedding party members via their digital invitations.', 18, 60);
  doc.text('• Guest phone numbers are provided to verify dedication shout-outs on the microphone.', 18, 65);

  // Table Header
  let currentY = 74;
  doc.setFillColor(212, 175, 55); // Gold Header Bar
  doc.rect(15, currentY, pageWidth - 30, 8, 'F');

  doc.setTextColor(17, 24, 15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('#', 18, currentY + 5.5);
  doc.text('Song Title & Artist', 28, currentY + 5.5);
  doc.text('Requested By', 105, currentY + 5.5);
  doc.text('Guest Phone', 145, currentY + 5.5);
  doc.text('Timing / Notes', 172, currentY + 5.5);

  currentY += 12;

  // Render Song Rows
  songs.forEach((song, idx) => {
    if (currentY > pageHeight - 30) {
      doc.addPage();
      // Background and border on new page
      doc.setFillColor(244, 239, 230);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(1.5);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
      currentY = 20;
    }

    // Alternating row background
    if (idx % 2 === 0) {
      doc.setFillColor(235, 230, 219);
      doc.rect(15, currentY - 4, pageWidth - 30, 12, 'F');
    }

    doc.setTextColor(28, 38, 25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(String(idx + 1), 18, currentY + 2);

    doc.setFont('helvetica', 'bold');
    doc.text(song.songTitle.substring(0, 36), 28, currentY + 1);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(85, 107, 78);
    doc.text(song.artist ? song.artist.substring(0, 38) : 'Bollywood Hits', 28, currentY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(28, 38, 25);
    doc.text(song.requestedByGuest.substring(0, 22), 105, currentY + 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(song.guestPhone || 'Via Invite', 145, currentY + 2);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 80, 10);
    const noteText = song.notes || 'Dance floor energy';
    doc.text(noteText.substring(0, 20), 172, currentY + 2);

    currentY += 12;
  });

  // Footer Signature
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.5);
  doc.line(20, pageHeight - 22, pageWidth - 20, pageHeight - 22);

  doc.setFont('times', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(100, 110, 95);
  doc.text(`Generated exclusively by Éternité Wedding Platform for ${project.formalTitle}`, pageWidth / 2, pageHeight - 16, { align: 'center' });

  // Trigger immediate download
  const filename = `DJ-Playlist-${project.slug}.pdf`;
  doc.save(filename);
}
