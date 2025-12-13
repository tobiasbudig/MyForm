import { motion } from 'framer-motion';

export default function NPS({ question, value, onChange, onSubmit }) {
  const handleSelect = (num) => {
    onChange(num);
    // Don't auto-advance - let user click Next button
  };

  const getButtonColor = (num) => {
    if (value === num) {
      return 'border-primary bg-primary text-white';
    }
    // Color gradient: red (0-6), yellow (7-8), green (9-10)
    if (num <= 6) {
      return 'border-red-300 hover:border-red-400 hover:bg-red-50';
    } else if (num <= 8) {
      return 'border-yellow-300 hover:border-yellow-400 hover:bg-yellow-50';
    } else {
      return 'border-green-300 hover:border-green-400 hover:bg-green-50';
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-11 gap-2">
        {Array.from({ length: 11 }, (_, i) => i).map((num, index) => (
          <motion.button
            key={num}
            type="button"
            onClick={() => handleSelect(num)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            className={`aspect-square px-2 py-3 border-2 rounded-lg transition-default hover:scale-105 ${getButtonColor(
              num
            )}`}
          >
            <div className="text-xl font-semibold">{num}</div>
          </motion.button>
        ))}
      </div>
      <div className="mt-6 flex justify-between text-sm text-textSecondary">
        <span>Not likely</span>
        <span>Very likely</span>
      </div>
    </div>
  );
}
