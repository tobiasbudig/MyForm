import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-6 text-center">
      <Link
        to="/impressum"
        className="text-sm text-textSecondary hover:text-textPrimary hover:underline transition-default"
      >
        Impressum
      </Link>
    </footer>
  );
}
