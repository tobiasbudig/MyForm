import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-screen px-6"
    >
      <div className="max-w-2xl text-center flex-1 flex items-center">
        <div>
          <h1 className="text-3xl sm:text-5xl font-bold text-textPrimary mb-12"> Willkommen</h1>

          <p className="text-lg sm:text-2xl font-medium text-textPrimary mb-12">
            Als Forschende der ETH Zürich möchten wir verstehen wie KI den Medizinischen Alltag verbessern kann! Die Umfrage dauert nur 3-4 Minuten - Wirklich!
Vielen Dank für ihre Hilfe!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/form/doctor"
              className="px-12 py-4 bg-primary text-white text-base sm:text-lg rounded-lg font-medium hover:bg-primary-hover transition-default hover:scale-105 hover:shadow-lg w-full sm:w-64 h-16 flex items-center justify-center"
            >
              Ich bin Ärzt*in
            </Link>
            <Link
              to="/form/mfa"
              className="px-12 py-4 bg-primary text-white text-base sm:text-lg rounded-lg font-medium hover:bg-primary-hover transition-default hover:scale-105 hover:shadow-lg w-full sm:w-64 h-16 flex items-center justify-center"
            >
              Ich bin MFA / MPA
            </Link>
            <Link
              to="/form/nurse"
              className="px-12 py-4 bg-primary text-white text-base sm:text-lg rounded-lg font-medium hover:bg-primary-hover transition-default hover:scale-105 hover:shadow-lg w-full sm:w-64 h-16 flex items-center justify-center"
            >
              Ich bin Pflegefachperson
            </Link>
            <Link
              to="/form/participant"
              className="px-12 py-4 bg-primary text-white text-base sm:text-lg rounded-lg font-medium hover:bg-primary-hover transition-default hover:scale-105 hover:shadow-lg w-full sm:w-64 h-16 flex items-center justify-center"
            >
              Ich bin Privatperson
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}

