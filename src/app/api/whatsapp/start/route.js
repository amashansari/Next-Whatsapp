// src/app/api/whatsapp/start/route.js
import { startWhatsappClient } from '@/lib/whatsapp/whatsappClient';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    const authDir = path.join(__dirname, '../../../../../.wwebjs_auth');
    const cacheDir = path.join(__dirname, '../../../../../.wwebjs_cache');

    // Delete folders if they exist
    const deleteFolder = async (folderPath) => {
      try {
        await fs.promises.access(folderPath);
        await path.rm(folderPath, { recursive: true, force: true, maxRetries: 3 });
        console.log(`Deleted: ${folderPath}`);
        return true;
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log(`Folder didn't exist: ${folderPath}`);
          return false;
        }
        console.error(`Error deleting ${folderPath}:`, err);
        throw err;
      }
    };

    // Delete folders
    await Promise.all([
      deleteFolder(authDir),
      deleteFolder(cacheDir)
    ]);


    // Now start WhatsApp client
    startWhatsappClient();

    return new Response(JSON.stringify({ status: 'started' }), { status: 200 });
  } catch (error) {
    console.error("Failed to start client:", error);
    return new Response(JSON.stringify({ status: 'error', error: error.message }), {
      status: 500,
    });
  }
}
