import { motion } from 'framer-motion';

export default function MultipleChoice({ question, value, onChange }) {
  const selected = Array.isArray(value) ? value : [];

  const handleToggle = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="w-full space-y-3">
      {question.options?.map((option, index) => {
        const isSelected = selected.includes(option);

        return (
          <motion.button
            key={option}
            type="button"
            onClick={() => handleToggle(option)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`w-full px-6 py-4 text-left border-2 rounded-lg transition-default hover:scale-[1.01] ${
              isSelected
                ? 'border-primary bg-primary-50 text-primary'
                : 'border-border hover:border-primary-light'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
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
              <span className="text-lg">{option}</span>
            </div>
          </motion.button>
        );
      })}
      {selected.length > 0 && (
        <div className="mt-4 text-sm text-textSecondary">
          {selected.length} selected
        </div>
      )}
    </div>
  );
}
