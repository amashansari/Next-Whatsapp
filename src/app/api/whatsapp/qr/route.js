// app/api/whatsapp/qr/route.js (App Router)
import { getQrImagePath  } from '@/lib/whatsapp/whatsappClient';

export async function GET() {
  const imagePath = getQrImagePath();

  if (!imagePath) {
    return Response.json({ status: 'pending' });
  }

  return Response.json({
    status: 'ready',
    qrImageUrl: imagePath, // static file path
  });
}
