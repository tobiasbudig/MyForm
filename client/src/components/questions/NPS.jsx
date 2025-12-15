import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import CommentInput from '../CommentInput';

export default function NPS({ question, value, onChange, onSubmit, comment, onCommentChange }) {
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  const timeoutRef = useRef(null);

  const handleSelect = (num) => {
    // Clear any existing timeout (handles rapid clicking)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    onChange(num);
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

  const getButtonColor = (num) => {
    if (value === num) {
      return 'border-primary bg-primary text-white';
    }
    return 'border-gray-300 hover:border-gray-400 hover:bg-gray-50';
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
        {Array.from({ length: 11 }, (_, i) => i).map((num, index) => (
          <motion.button
            key={num}
            type="button"
            onClick={() => handleSelect(num)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`aspect-square px-2 py-3 border-2 rounded-lg transition-default hover:scale-105 ${getButtonColor(
              num
            )}`}
          >
            <div className="text-xl font-semibold">{num}</div>
          </motion.button>
        ))}
      </div>
      <CommentInput value={comment} onChange={onCommentChange} />
    </div>
  );
}
