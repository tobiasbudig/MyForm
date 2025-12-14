import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center min-h-screen px-6"
    >
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-textPrimary mb-12">
          Willkommen
        </h1>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            to="/form/doctor"
            className="px-12 py-4 bg-primary text-white text-lg rounded-lg font-medium hover:bg-primary-hover transition-default hover:scale-105 hover:shadow-lg w-full sm:w-auto"
          >
            Für Mediziner
          </Link>
          <Link
            to="/form/mfa"
            className="px-12 py-4 bg-primary text-white text-lg rounded-lg font-medium hover:bg-primary-hover transition-default hover:scale-105 hover:shadow-lg w-full sm:w-auto"
          >
            Für MFA
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

