import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CommentInput from '../CommentInput';

export default function Grid({ question, value, onChange, onSubmit, comment, onCommentChange }) {
  // Value is an object: { statement_0: "Option A", statement_1: "Option B" }
  const selections = typeof value === 'object' && value !== null ? value : {};

  const statements = question.statements || [];
  const options = question.options || [];

  const [currentStatementIndex, setCurrentStatementIndex] = useState(0);

  // Normalize option to handle both string and object formats
  const normalizeOption = (option) => {
    if (typeof option === 'string') {
      return { text: option, description: null };
    }
    return option;
  };

  // Get option text for comparison
  const getOptionText = (option) => {
    const normalized = normalizeOption(option);
    return normalized.text;
  };

  const handleSelect = (statementIndex, option) => {
    const optionText = getOptionText(option);
    const newSelections = {
      ...selections,
      [`statement_${statementIndex}`]: optionText
    };
    onChange(newSelections);

    // Auto-advance to next statement or submit if last statement
    if (currentStatementIndex < statements.length - 1) {
      setTimeout(() => {
        setCurrentStatementIndex(currentStatementIndex + 1);
      }, 300);
    } else {
      // Last statement - auto-submit after delay
      setTimeout(() => {
        onSubmit();
      }, 300);
    }
  };

  const handlePrevStatement = () => {
    if (currentStatementIndex > 0) {
      setCurrentStatementIndex(currentStatementIndex - 1);
    }
  };

  const handleNextStatement = () => {
    if (currentStatementIndex < statements.length - 1) {
      setCurrentStatementIndex(currentStatementIndex + 1);
    }
  };

  return (
    <div className="w-full">
      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mb-6">
        {statements.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentStatementIndex
                ? 'bg-primary w-8'
                : selections[`statement_${idx}`]
                ? 'bg-primary-light w-2'
                : 'bg-gray-300 w-2'
            }`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="text-sm text-textSecondary text-center mb-6">
        {currentStatementIndex + 1} / {statements.length}
      </div>

      {/* Current Statement with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStatementIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Statement Text */}
          <h3 className="text-xl font-medium text-textPrimary text-center">
            {statements[currentStatementIndex]}
          </h3>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {options.map((option, optionIndex) => {
              const normalizedOption = normalizeOption(option);
              const isSelected = selections[`statement_${currentStatementIndex}`] === getOptionText(option);

              return (
                <motion.button
                  key={optionIndex}
                  type="button"
                  onClick={() => handleSelect(currentStatementIndex, option)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`px-4 py-3 text-sm sm:text-base border-2 rounded-lg transition-default hover:scale-[1.01] ${
                    isSelected
                      ? 'border-primary bg-primary-50 text-primary font-medium'
                      : 'border-border hover:border-primary-light'
                  }`}
                >
                  <div className="text-center">
                    <span className="block text-sm sm:text-base font-semibold">
                      {normalizedOption.text}
                    </span>
                    {normalizedOption.description && (
                      <span className="block text-xs text-gray-500 mt-1">
                        {normalizedOption.description}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            {currentStatementIndex > 0 && (
              <button
                type="button"
                onClick={handlePrevStatement}
                className="px-4 py-2 border-2 border-border rounded-lg hover:border-primary transition-default"
              >
                Previous
              </button>
            )}
            {currentStatementIndex < statements.length - 1 && selections[`statement_${currentStatementIndex}`] && (
              <button
                type="button"
                onClick={handleNextStatement}
                className="ml-auto px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-default"
              >
                Next
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <CommentInput value={comment} onChange={onCommentChange} />
    </div>
  );
}
