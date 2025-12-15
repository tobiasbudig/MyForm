import { Link } from 'react-router-dom';

export default function FixedFooter() {
  return (
    <div className="fixed bottom-0 left-0 p-6 z-10">
      <Link
        to="/impressum"
        className="text-sm text-textSecondary hover:text-textPrimary hover:underline transition-default"
      >
        Impressum
      </Link>
    </div>
  );
}
