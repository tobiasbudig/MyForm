import { motion } from 'framer-motion';

export default function LikertScale({ question, value, onChange, onSubmit }) {
  const scale = question.scale || 5;
  const labels = question.labels || [];

  const handleSelect = (val) => {
    onChange(val);
    // Don't auto-advance - let user click Next button
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {Array.from({ length: scale }, (_, i) => i + 1).map((num, index) => (
          <motion.button
            key={num}
            type="button"
            onClick={() => handleSelect(num)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`flex-1 min-w-[60px] px-4 py-3 border-2 rounded-lg transition-default hover:scale-105 ${
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
      {labels.length > 0 && (
        <div className="mt-6 flex justify-between text-sm text-textSecondary">
          <span>{labels[0]}</span>
          <span>{labels[labels.length - 1]}</span>
        </div>
      )}
    </div>
  );
}
