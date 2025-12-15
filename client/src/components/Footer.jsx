import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-6 text-center">
      <div className="flex items-center justify-center gap-3 text-sm text-textSecondary">
        <span>Sicher gehostet in der Schweiz 🇨🇭</span>
        <span>•</span>
        <Link
          to="/impressum"
          className="hover:text-textPrimary hover:underline transition-default"
        >
          Impressum
        </Link>
      </div>
    </footer>
  );
}
