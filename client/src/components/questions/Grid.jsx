import { motion } from 'framer-motion';
import CommentInput from '../CommentInput';

export default function Grid({ question, value, onChange, onSubmit, comment, onCommentChange }) {
  // Value is an object: { statement_0: "Option A", statement_1: "Option B" }
  const selections = typeof value === 'object' && value !== null ? value : {};

  const statements = question.statements || [];
  const options = question.options || [];

  const handleSelect = (statementIndex, option) => {
    const newSelections = {
      ...selections,
      [`statement_${statementIndex}`]: option
    };
    onChange(newSelections);
  };

  const hasAnyAnswer = Object.keys(selections).length > 0;

  return (
    <div className="w-full space-y-6">
      {statements.map((statement, statementIndex) => {
        const selectedOption = selections[`statement_${statementIndex}`];

        return (
          <motion.div
            key={statementIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: statementIndex * 0.1 }}
            className="border-2 border-border rounded-lg p-6 space-y-4"
          >
            <h3 className="text-lg font-medium text-textPrimary">
              {statement}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {options.map((option, optionIndex) => {
                const isSelected = selectedOption === option;

                return (
                  <motion.button
                    key={optionIndex}
                    type="button"
                    onClick={() => handleSelect(statementIndex, option)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: statementIndex * 0.1 + optionIndex * 0.03 }}
                    className={`px-4 py-3 text-sm sm:text-base border-2 rounded-lg transition-default hover:scale-[1.01] ${
                      isSelected
                        ? 'border-primary bg-primary-50 text-primary font-medium'
                        : 'border-border hover:border-primary-light'
                    }`}
                  >
                    <span className="block text-center">{option}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {hasAnyAnswer && (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          onClick={onSubmit}
          className="w-full px-6 py-4 bg-primary text-white rounded-lg transition-default hover:opacity-90 font-medium text-lg"
        >
          Continue
        </motion.button>
      )}

      <CommentInput value={comment} onChange={onCommentChange} />
    </div>
  );
}
