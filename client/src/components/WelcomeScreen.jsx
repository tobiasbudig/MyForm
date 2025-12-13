import { motion } from 'framer-motion';

export default function WelcomeScreen({ welcome, onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center min-h-screen px-6"
    >
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-textPrimary mb-6">
          {welcome.heading}
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
    </motion.div>
  );
}
