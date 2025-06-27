// src/app/api/whatsapp/start/route.js
import { startWhatsappClient } from '@/lib/whatsapp/whatsappClient';

export async function POST() {
  startWhatsappClient(); // Ensure this runs once
  return Response.json({ status: 'started' });
}
