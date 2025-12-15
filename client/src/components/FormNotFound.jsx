import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from './Footer';

export default function FormNotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen px-6"
    >
      <div className="max-w-md text-center flex-1 flex items-center">
        <div>
          <h1 className="text-6xl font-bold text-textPrimary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-textPrimary mb-4">
            Formular nicht gefunden
          </h2>
          <p className="text-textSecondary mb-8">
            Das gesuchte Formular existiert nicht.
          </p>
          <Link
            to="/form/demo"
            className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-default"
          >
            Demo-Formular ausprobieren
          </Link>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
