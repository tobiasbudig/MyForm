import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function FormNotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-screen px-6"
    >
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-textPrimary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-textPrimary mb-4">
          Form Not Found
        </h2>
        <p className="text-textSecondary mb-8">
          The questionnaire you're looking for doesn't exist.
        </p>
        <Link
          to="/form/demo"
          className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-default"
        >
          Try Demo Form
        </Link>
      </div>
    </motion.div>
  );
}
