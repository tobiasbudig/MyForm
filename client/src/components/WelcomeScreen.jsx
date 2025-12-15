import { motion } from 'framer-motion';
import Footer from './Footer';

export default function WelcomeScreen({ welcome, onStart }) {
  // Split heading by newlines to support multi-line titles
  const headingLines = welcome.heading.split('\n').filter(line => line.trim());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-screen px-6"
    >
      <div className="max-w-2xl text-center flex-1 flex items-center">
        <div>
          <h1 className="text-5xl font-bold text-textPrimary mb-6">
            {headingLines.map((line, index) => (
              <span key={index}>
                {line}
                {index < headingLines.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className="text-xl text-textSecondary mb-12">
            {welcome.body}
          </p>
          <button
            onClick={onStart}
            className="px-12 py-4 bg-primary text-white text-lg rounded-lg font-medium hover:bg-primary-hover transition-default hover:scale-105 hover:shadow-lg"
          >
            {welcome.buttonText}
          </button>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
