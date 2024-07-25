// src/pages/redirect.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from "@/styles/Home.module.scss";

export default function RedirectPage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function getQrs() {
      if (!id) return;

      const res = await fetch(`/api/qr`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const response = await res.json();
        const matchedQr = response.qrs.find(qr => qr._id === id);

        if (matchedQr) {
          window.location.href = matchedQr.URL;
        } else {
          setError('ID not found in the database.');
          setLoading(false);
        }
      } else {
        setError('Failed to fetch QR codes.');
        setLoading(false);
      }
    }

    getQrs();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.error}>
      <p>{error}</p>
    </div>
  );
}
