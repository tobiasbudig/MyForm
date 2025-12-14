import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SingleChoice({ question, value, onChange, onSubmit }) {
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  const timeoutRef = useRef(null);

  const handleSelect = (option) => {
    // Clear any existing timeout (handles rapid clicking)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    onChange(option);
    setIsAutoAdvancing(true);

    timeoutRef.current = setTimeout(() => {
      onSubmit();
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full space-y-3">
      {question.options?.map((option, index) => (
        <motion.button
          key={option}
          type="button"
          onClick={() => handleSelect(option)}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isAutoAdvancing && value === option ? [1, 0.4, 1, 0.4, 1] : 1,
            y: 0
          }}
          transition={{
            delay: index * 0.05,
            opacity: { duration: 0.3, ease: "easeInOut" }
          }}
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
