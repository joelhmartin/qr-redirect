import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const RedirectToFacebook = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Uncomment this if you need to fetch data based on id
  // useEffect(() => {
  //   async function getQrs() {
  //     if (!id) return;

  //     const res = await fetch(`/api/qr`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (res.ok) {
  //       const response = await res.json();
  //       const matchedQr = response.qrs.find((qr) => qr._id === id);

  //       if (matchedQr) {
  //         window.location.href = matchedQr.URL;
  //       } else {
  //         setError('ID not found in the database.');
  //         setLoading(false);
  //       }
  //     } else {
  //       setError('Failed to fetch QR codes.');
  //       setLoading(false);
  //     }
  //   }

  //   getQrs();
  // }, [id]);

  useEffect(() => {
    const appScheme = 'fb://profile'; // Facebook URL scheme
    const appStoreUrl = 'https://apps.apple.com/us/app/facebook/id284882215';

    const openApp = () => {
      const now = Date.now();
      const delay = 1500;

      // Attempt to open the app using the URL scheme
      window.location.href = appScheme;

      // Polling to detect if the user is still on the same page after the delay
      setTimeout(() => {
        if (Date.now() - now < delay + 100) {
          window.location.href = appStoreUrl;
        }
      }, delay);
    };

    openApp();
  }, []);

  return <div>Redirecting to Facebook...</div>;
};

export default RedirectToFacebook;
