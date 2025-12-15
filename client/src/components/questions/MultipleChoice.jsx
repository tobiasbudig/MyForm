import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CommentInput from '../CommentInput';
import OtherInput from '../OtherInput';

export default function MultipleChoice({ question, value, onChange, comment, onCommentChange }) {
  const selected = Array.isArray(value) ? value : [];
  const [otherText, setOtherText] = useState('');

  // Create display options (add "Other" if has_other is true)
  const displayOptions = question.has_other
    ? [...(question.options || []), 'Other']
    : question.options || [];
  
  // Map display text for translation
  const getDisplayText = (option) => option === 'Other' ? 'Sonstiges' : option;

  // Check if "Other" is selected (can be "Other" or "Other: custom text")
  const isOtherSelected = selected.some(item =>
    item === 'Other' || item.startsWith('Other: ')
  );

  // Extract custom text if exists
  const otherValue = selected.find(item => item.startsWith('Other: '));
  const extractedText = otherValue ? otherValue.replace('Other: ', '') : '';

  // Initialize otherText from existing value
  useEffect(() => {
    if (extractedText) {
      setOtherText(extractedText);
    }
  }, [extractedText]);

  const handleToggle = (option) => {
    if (option === 'Other') {
      if (isOtherSelected) {
        // Remove all "Other: ..." entries
        const filtered = selected.filter(item =>
          item !== 'Other' && !item.startsWith('Other: ')
        );
        onChange(filtered);
        setOtherText('');
      } else {
        // Add placeholder "Other"
        onChange([...selected, 'Other']);
      }
    } else {
      // Normal toggle logic
      if (selected.includes(option)) {
        onChange(selected.filter((item) => item !== option));
      } else {
        onChange([...selected, option]);
      }
    }
  };

  const handleOtherTextChange = (text) => {
    setOtherText(text);

    // Replace "Other" or "Other: ..." with new custom text
    const filtered = selected.filter(item =>
      item !== 'Other' && !item.startsWith('Other: ')
    );

    if (text.trim()) {
      onChange([...filtered, `Other: ${text.trim()}`]);
    } else {
      onChange([...filtered, 'Other']);
    }
  };

  return (
    <div className="w-full space-y-3">
      {displayOptions.map((option, index) => {
        const isSelected = option === 'Other'
          ? isOtherSelected
          : selected.includes(option);

        return (
          <motion.button
            key={option}
            type="button"
            onClick={() => handleToggle(option)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`w-full px-4 py-3 sm:px-6 sm:py-4 text-left border-2 rounded-lg transition-default hover:scale-[1.01] ${
              isSelected
                ? 'border-primary bg-primary-50 text-primary'
                : 'border-border hover:border-primary-light'
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className={`w-6 h-6 sm:w-5 sm:h-5 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'border-primary bg-primary' : 'border-gray-400'
                }`}
              >
                {isSelected && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </div>
              <span className="text-base sm:text-lg">{getDisplayText(option)}</span>
            </div>
          </motion.button>
        );
      })}

      {isOtherSelected && (
        <OtherInput
          value={otherText}
          onChange={handleOtherTextChange}
          show={isOtherSelected}
        />
      )}

      {selected.length > 0 && (
        <div className="mt-4 text-sm text-textSecondary">
          {selected.length} ausgewählt
        </div>
      )}
      <CommentInput value={comment} onChange={onCommentChange} />
    </div>
  );
}
