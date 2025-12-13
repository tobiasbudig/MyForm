import { motion } from 'framer-motion';

export default function SingleChoice({ question, value, onChange, onSubmit }) {
  const handleSelect = (option) => {
    onChange(option);
    // Don't auto-advance - let user click Next button
  };

  return (
    <div className="w-full space-y-3">
      {question.options?.map((option, index) => (
        <motion.button
          key={option}
          type="button"
          onClick={() => handleSelect(option)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`w-full px-6 py-4 text-left border-2 rounded-lg transition-default hover:scale-[1.01] ${
            value === option
              ? 'border-primary bg-primary-50 text-primary'
              : 'border-border hover:border-primary-light'
          }`}
        >
          <span className="text-lg">{option}</span>
        </motion.button>
      ))}
    </div>
  );
}
