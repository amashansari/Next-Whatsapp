'use client';

import { useState } from 'react';

export default function QrDisplay() {
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const startWhatsApp = async () => {
    setLoading(true);
    setQrImage(null);

    // Start the WhatsApp client
    await fetch('/api/whatsapp/start', { method: 'POST' });

    // Keep polling until QR is ready
    const poll = setInterval(async () => {
      const res = await fetch('/api/whatsapp/qr');
      const data = await res.json();

      if (data.status === 'ready') {
        clearInterval(poll);
        setQrImage(data.qrImage);
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <button
        onClick={startWhatsApp}
        disabled={loading}
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        {loading ? 'Generating QR...' : 'Generate WhatsApp QR'}
      </button>

      {qrImage && (
        <div style={{ marginTop: '20px' }}>
          <img src={qrImage} alt="WhatsApp QR Code" />
        </div>
      )}
    </div>
  );
}
