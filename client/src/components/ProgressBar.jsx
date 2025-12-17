import { motion } from 'framer-motion';

export default function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 h-2 bg-gray-200 z-50">
      <motion.div
        className="h-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  );
}
