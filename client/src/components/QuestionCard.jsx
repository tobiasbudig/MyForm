import { motion } from 'framer-motion';
import ShortText from './questions/ShortText';
import LongText from './questions/LongText';
import SingleChoice from './questions/SingleChoice';
import MultipleChoice from './questions/MultipleChoice';
import LikertScale from './questions/LikertScale';
import NPS from './questions/NPS';

const questionComponents = {
  short_text: ShortText,
  long_text: LongText,
  single_choice: SingleChoice,
  multiple_choice: MultipleChoice,
  likert: LikertScale,
  nps: NPS,
};

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  value,
  onChange,
  onSubmit,
}) {
  const QuestionComponent = questionComponents[question.type];

  if (!QuestionComponent) {
    return (
      <div className="text-error">
        Unknown question type: {question.type}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto px-6"
    >
      <div className="mb-4 text-sm text-textSecondary">
        Question {questionNumber} of {totalQuestions}
      </div>

      <h2 className="text-3xl font-semibold text-textPrimary mb-2">
        {question.text}
        {question.required && <span className="text-error ml-1">*</span>}
      </h2>

      {question.help && (
        <p className="text-textSecondary mb-8">{question.help}</p>
      )}

      <div className="mt-8">
        <QuestionComponent
          question={question}
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      </div>
    </motion.div>
  );
}
