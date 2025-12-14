import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommentInput({ value, onChange, maxLength = 500 }) {
  const [isExpanded, setIsExpanded] = useState(!!value);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-2 text-textSecondary hover:text-primary transition-default"
      >
        <MessageSquare size={20} />
        <span className="text-sm">
          {isExpanded ? 'Kommentar ausblenden' : 'Kommentar hinzufügen (optional)'}
        </span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <textarea
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Zusätzliche Gedanken oder Kontext hinzufügen..."
              maxLength={maxLength}
              rows={3}
              className="w-full mt-3 px-4 py-3 text-base border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-default resize-none"
            />
            <div className="text-sm text-textSecondary text-right mt-1">
              {(value || '').length} / {maxLength}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
