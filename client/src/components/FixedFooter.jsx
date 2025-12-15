import { Link } from 'react-router-dom';

export default function FixedFooter() {
  return (
    <div className="mt-auto p-6">
      <div className="flex items-center gap-3 text-sm text-textSecondary">
        <span>Sicher gehostet in der Schweiz 🇨🇭</span>
        <span>•</span>
        <Link
          to="/impressum"
          className="hover:text-textPrimary hover:underline transition-default"
        >
          Impressum
        </Link>
      </div>
    </div>
  );
}
