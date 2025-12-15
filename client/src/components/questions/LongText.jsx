import { useEffect, useRef } from 'react';
import CommentInput from '../CommentInput';

export default function LongText({ question, value, onChange, onSubmit, comment, onCommentChange }) {
  const textareaRef = useRef(null);
  const maxLength = question.maxLength || 2000;

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full">
      <textarea
        ref={textareaRef}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={question.placeholder || 'Your answer...'}
        maxLength={maxLength}
        rows={6}
        className="w-full px-4 py-3 text-lg border border-border rounded-lg focus:border-primary focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-default resize-y"
      />
      <div className="mt-2 text-sm text-textSecondary text-right">
        {(value || '').length} / {maxLength}
      </div>
      <CommentInput value={comment} onChange={onCommentChange} />
    </div>
  );
}
