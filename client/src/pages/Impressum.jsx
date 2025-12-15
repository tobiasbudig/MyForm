import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Impressum() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-screen px-6 py-12"
    >
      <div className="max-w-3xl w-full">
        <h1 className="text-5xl font-bold text-textPrimary mb-8">Impressum</h1>

        <div className="text-textSecondary space-y-6">
          <p className="text-lg">
            [Placeholder content - will be replaced with actual company information]
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-textPrimary mb-3">Angaben gemäß § 5 TMG</h2>
            <p>[Company name and address]</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-textPrimary mb-3">Kontakt</h2>
            <p>[Contact information]</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-textPrimary mb-3">Verantwortlich für den Inhalt</h2>
            <p>[Responsible person/entity]</p>
          </section>
        </div>

        <Link
          to="/"
          className="inline-block mt-12 text-primary hover:text-primary-hover transition-default"
        >
          ← Zurück zur Startseite
        </Link>
      </div>
    </motion.div>
  );
}
