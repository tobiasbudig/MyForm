import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import CommentInput from '../CommentInput';

export default function LikertScale({ question, value, onChange, onSubmit, comment, onCommentChange }) {
  const scale = question.scale || 5;
  const labels = question.labels || [];
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  const timeoutRef = useRef(null);

  const handleSelect = (val) => {
    // Clear any existing timeout (handles rapid clicking)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    onChange(val);
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
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-stretch gap-4">
        {Array.from({ length: scale }, (_, i) => i + 1).map((num, index) => (
          <motion.button
            key={num}
            type="button"
            onClick={() => handleSelect(num)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`w-full sm:w-auto sm:flex-1 px-4 py-3 border-2 rounded-lg transition-default hover:scale-105 ${
              value === num
                ? 'border-primary bg-primary text-white'
                : 'border-border hover:border-primary'
            }`}
          >
            <div className="text-2xl font-semibold">{num}</div>
            {labels[index] && (
              <div className="text-xs mt-1 opacity-80">{labels[index]}</div>
            )}
          </motion.button>
        ))}
      </div>
      <CommentInput value={comment} onChange={onCommentChange} />
    </div>
  );
}
