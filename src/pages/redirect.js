// src/pages/redirect.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.scss";

export default function RedirectPage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        const matchedQr = response.qrs.find((qr) => qr._id === id);

        if (matchedQr) {
          window.location.href = matchedQr.URL;
        } else {
          setError("ID not found in the database.");
          setLoading(false);
        }
      } else {
        setError("Failed to fetch QR codes.");
        setLoading(false);
      }
    }

    getQrs();
  }, [id]);

  if (loading) {
    return (
      <div class="loader">
        <div class="square" id="sq1"></div>
        <div class="square" id="sq2"></div>
        <div class="square" id="sq3"></div>
        <div class="square" id="sq4"></div>
        <div class="square" id="sq5"></div>
        <div class="square" id="sq6"></div>
        <div class="square" id="sq7"></div>
        <div class="square" id="sq8"></div>
        <div class="square" id="sq9"></div>
      </div>
    );
  }

  return (
    <div className={styles.error}>
      <p>{error}</p>
    </div>
  );
}
