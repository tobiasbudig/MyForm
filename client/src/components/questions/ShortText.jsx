import { useEffect, useRef } from 'react';
import CommentInput from '../CommentInput';

export default function ShortText({ question, value, onChange, onSubmit, comment, onCommentChange }) {
  const inputRef = useRef(null);
  const maxLength = question.maxLength || 200;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={question.placeholder || 'Your answer...'}
        maxLength={maxLength}
        className="w-full px-4 py-3 text-lg border-2 border-border rounded-lg focus:border-primary transition-default"
      />
      <div className="mt-2 text-sm text-textSecondary text-right">
        {(value || '').length} / {maxLength}
      </div>
      <CommentInput value={comment} onChange={onCommentChange} />
    </div>
  );
}
