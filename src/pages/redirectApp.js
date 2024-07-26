import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.scss";

const RedirectToFacebook = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   async function getQrs() {
  //     if (!id) return;

  //     const res = await fetch(`/api/qr`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (res.ok) {
  //       const response = await res.json();
  //       const matchedQr = response.qrs.find((qr) => qr._id === id);

  //       if (matchedQr) {
  //         window.location.href = matchedQr.URL;
  //       } else {
  //         setError("ID not found in the database.");
  //         setLoading(false);
  //       }
  //     } else {
  //       setError("Failed to fetch QR codes.");
  //       setLoading(false);
  //     }
  //   }

  //   getQrs();
  // }, [id]);

  useEffect(() => {
    const appScheme = 'fb://profile'; // Facebook URL scheme
    const appStoreUrl = 'https://apps.apple.com/us/app/facebook/id284882215';

    const openApp = () => {
      // Create a hidden iframe to attempt to open the app
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = appScheme;
      document.body.appendChild(iframe);

      // Set a timeout to redirect to the App Store if the app does not open
      setTimeout(() => {
        window.location.href = appStoreUrl;
      }, 2000);

      // Clean up the iframe after a short delay
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 2500);
    };

    openApp();
  }, []);

  return (
    <div>
      Redirecting to Facebook...
    </div>
  );
};

export default RedirectToFacebook;