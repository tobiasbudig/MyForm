import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-screen px-12 sm:px-6"
    >
      <div className="max-w-2xl text-center flex-1 flex flex-col items-center justify-center">
        <div>
          <h1 className="text-3xl sm:text-6xl font-bold text-textPrimary mb-12"> Willkommen</h1>

          <p className="text-lg sm:text-2xl font-medium text-gray-500 mb-12">
            Als Forschende der ETH Zürich möchten wir verstehen wie KI den Medizinischen Alltag verbessern kann! <br /> Die Umfrage dauert nur 3-4 Minuten - Versprochen!  <br />
Vielen Dank für ihre Hilfe!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl mx-auto">
            <Link
              to="/form/doctor"
              className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-primary text-white text-base sm:text-lg rounded-lg font-medium hover:bg-primary-hover transition-default hover:scale-105 hover:shadow-lg h-16 flex items-center justify-center"
            >
              Ich bin Ärzt*in
            </Link>
            <Link
              to="/form/mfa"
              className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-primary text-white text-base sm:text-lg rounded-lg font-medium hover:bg-primary-hover transition-default hover:scale-105 hover:shadow-lg h-16 flex items-center justify-center"
            >
              Ich bin MFA / MPA
            </Link>
            <Link
              to="/form/nurse"
              className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-primary text-white text-base sm:text-lg rounded-lg font-medium hover:bg-primary-hover transition-default hover:scale-105 hover:shadow-lg h-16 flex items-center justify-center"
            >
              Ich bin Pflegefachperson
            </Link>
            <Link
              to="/form/participant"
              className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-primary text-white text-base sm:text-lg rounded-lg font-medium hover:bg-primary-hover transition-default hover:scale-105 hover:shadow-lg h-16 flex items-center justify-center"
            >
              Alle anderen
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}

