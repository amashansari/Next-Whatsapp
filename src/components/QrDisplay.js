// components/QrDisplay.js
'use client';
import { useEffect, useState } from 'react';

export default function QrDisplay() {
  const [qrImage, setQrImage] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const fetchQr = async () => {
      const res = await fetch('/api/whatsapp/qr');
      const data = await res.json();
      setStatus(data.status);
      if (data.qrImage) setQrImage(data.qrImage);
    };

    fetchQr();
    const interval = setInterval(fetchQr, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      {status === 'loading' && <p>Loading QR...</p>}
      {status === 'waiting' && <p>Generating QR Code...</p>}
      {qrImage && <img src={qrImage} alt="WhatsApp QR Code" />}
    </div>
  );
}
