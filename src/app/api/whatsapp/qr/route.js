// app/api/whatsapp/qr/route.js (App Router)
import { getQrImage } from '@/lib/whatsapp/whatsappClient';

export async function GET() {
  const qrImage = getQrImage();

  if (!qrImage) {
    return new Response(JSON.stringify({ status: 'waiting', message: 'QR not ready' }), {
      status: 202,
    });
  }

  return new Response(JSON.stringify({ status: 'ready', qrImage }), {
    status: 200,
  });
  
}
