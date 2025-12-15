import { motion } from 'framer-motion';
import Footer from './Footer';

export default function ThankYouScreen({ thankYou }) {
  // Split heading by newlines to support multi-line titles
  const headingLines = thankYou.heading.split('\n').filter(line => line.trim());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-screen px-6"
    >
      <div className="max-w-2xl text-center flex-1 flex items-center">
        <div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <svg
              className="w-20 h-20 text-success"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </motion.div>
          <h1 className="text-5xl font-bold text-textPrimary mb-6">
            {headingLines.map((line, index) => (
              <span key={index}>
                {line}
                {index < headingLines.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className="text-xl text-textSecondary mb-12">
            {thankYou.body}
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8"
          >
            <p className="text-lg text-textSecondary mb-6">
              Als Dankeschön ein KI Transkruptions Tool bekommen
            </p>
            <a
              href="mailto:example@mail.com"
              className="inline-block px-12 py-4 bg-primary text-white text-lg rounded-lg font-medium hover:bg-primary-hover transition-default hover:scale-105 hover:shadow-lg"
            >
              Email schreiben
            </a>
          </motion.div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
