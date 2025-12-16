import { motion } from 'framer-motion';

export default function Information({ question }) {
  return (
    <div className="w-full space-y-6">
      {/* Description Section */}
      {question.description && (
        <div className="text-lg text-textPrimary whitespace-pre-wrap">
          {question.description}
        </div>
      )}

      {/* Image Section - Optional */}
      {question.image && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg overflow-hidden shadow-lg"
        >
          <img
            src={`/api/resources/${question.image}`}
            alt={question.imageAlt || question.text}
            className="w-full h-auto max-h-96 object-contain bg-gray-50"
            onError={(e) => {
              // Graceful fallback if image fails to load
              e.target.style.display = 'none';
              console.error(`Failed to load image: ${question.image}`);
            }}
          />
        </motion.div>
      )}
    </div>
  );
}
