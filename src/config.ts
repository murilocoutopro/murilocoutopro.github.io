// Convite fornecido pelo responsável pela campanha. Acesso após cadastro salvo.
export const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/GTjgkweL5UR7KAAdaO2DDe';
export const config = {
  name: 'Fluxos de Cura 2026', year: 2026,
  date: {day: '24', month: 'outubro', monthShort: 'OUT', weekday: 'Sábado', iso: '2026-10-24T17:00:00-03:00'},
  time: '17h', timezone: 'horário de Brasília',
  instagram: 'https://www.instagram.com/christembassycaucaia/',
  instagramHandle: '@christembassycaucaia',
  church: 'Christ Embassy Caucaia',
  address: 'Rua Tampico, 440 — Caucaia, CE',
  localDate: 'Sábado, 24 de outubro', localTime: '17h',
  churchPhone: '(85) 9204-9438',
  contactWhatsappUrl: 'https://wa.me/558592049438',
  ministry: 'Christ Embassy / Loveworld',
  heroTitle: 'Uma atmosfera de fé para todos.',
  heroDescription: 'Um encontro de oração, Palavra de Deus e esperança. Esperamos você e sua família na Christ Embassy Caucaia.',
  localHost: 'Pastor Joaquim',
  participationNote: 'Encontro local com o Pastor Joaquim. A imagem do Pastor Chris integra a campanha do ministério; não indica presença física em Caucaia.',
  groupHint: 'Inscreva-se para receber acesso ao grupo exclusivo e às informações do evento.',
  images: {campaign: '/assets/hero2.jpg', alt: 'Pastor Chris e Pastor Joaquim ministrando na arte dos Fluxos de Cura, com iluminação quente e fundo escuro'},
  analytics: {metaPixelId: '', ga4Id: ''},
};
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.church+' '+config.address)}`;
export function groupUrl(): string | null {
  try {const u = new URL(WHATSAPP_GROUP_URL);return u.protocol === 'https:' && u.hostname === 'chat.whatsapp.com' && u.pathname.length > 1 ? u.href : null;} catch {return null;}
}
