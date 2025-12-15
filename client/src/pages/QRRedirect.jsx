import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import qrRedirects from '../config/qrRedirects.json';

export default function QRRedirect() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const targetUrl = qrRedirects[id];

    if (!targetUrl) {
      navigate('/', { replace: true });
      return;
    }

    if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
      window.location.href = targetUrl;
    } else {
      navigate(targetUrl, { replace: true });
    }
  }, [id, navigate]);

  return null;
}
