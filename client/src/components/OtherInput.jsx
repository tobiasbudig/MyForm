import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OtherInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Please specify...',
  maxLength = 200,
  show = true,
}) {
  const inputRef = useRef(null);

  // Auto-focus when shown
  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <input
            ref={inputRef}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full mt-3 px-4 py-3 text-base border border-border rounded-lg focus:border-primary focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-default"
          />
          <div className="mt-1 text-sm text-textSecondary text-right">
            {(value || '').length} / {maxLength}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
