import { motion } from 'framer-motion';
import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import ShortText from './questions/ShortText';
import LongText from './questions/LongText';
import SingleChoice from './questions/SingleChoice';
import MultipleChoice from './questions/MultipleChoice';
import LikertScale from './questions/LikertScale';
import NPS from './questions/NPS';
import Grid from './questions/Grid';
import Modal from './Modal';

const questionComponents = {
  short_text: ShortText,
  long_text: LongText,
  single_choice: SingleChoice,
  multiple_choice: MultipleChoice,
  likert: LikertScale,
  nps: NPS,
  grid: Grid,
};

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  value,
  onChange,
  onSubmit,
  comment,
  onCommentChange,
}) {
  const [showExplanation, setShowExplanation] = useState(false);
  const QuestionComponent = questionComponents[question.type];

  if (!QuestionComponent) {
    return (
      <div className="text-error">
        Unbekannter Fragetyp: {question.type}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-2xl mx-auto flex flex-col h-full"
    >
      {/* Header Section - stays visible */}
      <div className="bg-white px-6 pb-4 pt-2">
        <div className="mb-4 text-sm text-textSecondary">
          Frage {questionNumber} von {totalQuestions}
        </div>

        <h2 className="text-3xl font-semibold text-textPrimary mb-2 flex items-center gap-2">
          <span>
            {question.text}
            {question.required && <span className="text-error ml-1">*</span>}
          </span>
          {question.explanation && (
            <button
              type="button"
              onClick={() => setShowExplanation(true)}
              className="text-textSecondary hover:text-primary transition-default"
              aria-label="Erklärung anzeigen"
            >
              <HelpCircle size={24} />
            </button>
          )}
        </h2>

        {question.help && (
          <p className="text-textSecondary">{question.help}</p>
        )}
      </div>

      {/* Content Section - scrolls when needed */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="mt-4">
          <QuestionComponent
            question={question}
            value={value}
            onChange={onChange}
            onSubmit={onSubmit}
            comment={comment}
            onCommentChange={onCommentChange}
          />
        </div>
      </div>

      <Modal
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
        title="Erklärung"
      >
        <p className="text-textPrimary">{question.explanation}</p>
      </Modal>
    </motion.div>
  );
}
