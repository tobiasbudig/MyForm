import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import CommentInput from '../CommentInput';
import OtherInput from '../OtherInput';

export default function SingleChoice({ question, value, onChange, onSubmit, comment, onCommentChange }) {
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherText, setOtherText] = useState('');
  const timeoutRef = useRef(null);

  // Normalize option to handle both string and object formats
  const normalizeOption = (option) => {
    if (typeof option === 'string') {
      return { text: option, description: null };
    }
    return option;
  };

  // Create display options (add "Other" if has_other is true)
  const displayOptions = question.has_other
    ? [...(question.options || []), 'Other']
    : question.options || [];

  // Map display text for translation
  const getDisplayText = (option) => {
    if (option === 'Other') return 'Sonstiges';
    const normalized = normalizeOption(option);
    return normalized.text;
  };

  // Get option text for comparison
  const getOptionText = (option) => {
    if (option === 'Other') return 'Other';
    const normalized = normalizeOption(option);
    return normalized.text;
  };

  // Initialize "Other" state from existing value
  useEffect(() => {
    if (value && !question.options?.includes(value) && question.has_other) {
      // Value is custom "Other" text
      setShowOtherInput(true);
      setOtherText(value);
    }
  }, [value, question.options, question.has_other]);

  const handleSelect = (option) => {
    // Clear any existing timeout (handles rapid clicking)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (option === 'Other') {
      // Show "Other" input, don't auto-advance yet
      setShowOtherInput(true);
      onChange(''); // Clear value temporarily
    } else {
      // Normal option selected - store the text value
      setShowOtherInput(false);
      setOtherText('');
      onChange(getOptionText(option));
      setIsAutoAdvancing(true);

      timeoutRef.current = setTimeout(() => {
        onSubmit();
      }, 300);
    }
  };

  const handleOtherChange = (text) => {
    setOtherText(text);
    onChange(text); // Store custom text as value
  };

  const handleOtherSubmit = () => {
    if (otherText.trim()) {
      setIsAutoAdvancing(true);
      timeoutRef.current = setTimeout(() => {
        onSubmit();
      }, 300);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Check if current value is for "Other" option
  const isOtherSelected = showOtherInput || (value && !question.options?.includes(value));

  return (
    <div className="w-full space-y-3">
      {displayOptions.map((option, index) => {
        const normalizedOption = normalizeOption(option);
        const isSelected = option === 'Other'
          ? isOtherSelected
          : value === getOptionText(option);

        return (
          <motion.button
            key={typeof option === 'string' ? option : option.text}
            type="button"
            onClick={() => handleSelect(option)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`w-full px-6 py-4 text-left border-2 rounded-lg transition-default hover:scale-[1.01] ${
              isSelected
                ? 'border-primary bg-primary-50 text-primary'
                : 'border-border hover:border-primary-light'
            }`}
          >
            <div>
              <span className="text-lg font-semibold block">{getDisplayText(option)}</span>
              {normalizedOption.description && (
                <span className="text-sm text-gray-500 mt-1 block">
                  {normalizedOption.description}
                </span>
              )}
            </div>
          </motion.button>
        );
      })}

      {showOtherInput && (
        <OtherInput
          value={otherText}
          onChange={handleOtherChange}
          onSubmit={handleOtherSubmit}
          show={showOtherInput}
        />
      )}

      <CommentInput value={comment} onChange={onCommentChange} />
    </div>
  );
}
