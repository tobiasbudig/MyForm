import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { getForm, startSubmission, saveAnswer, completeSubmission } from '../utils/api';
import ProgressBar from '../components/ProgressBar';
import WelcomeScreen from '../components/WelcomeScreen';
import QuestionCard from '../components/QuestionCard';
import NavigationButtons from '../components/NavigationButtons';
import ThankYouScreen from '../components/ThankYouScreen';
import FormNotFound from '../components/FormNotFound';

export default function FormPage() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 = welcome screen
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Load form configuration
  useEffect(() => {
    async function loadForm() {
      try {
        setLoading(true);
        const response = await getForm(formId);
        if (response.success) {
          setForm(response.data);
        } else {
          setError('Form not found');
        }
      } catch (err) {
        console.error('Error loading form:', err);
        setError('Form not found');
      } finally {
        setLoading(false);
      }
    }

    loadForm();
  }, [formId]);

  // Start submission when entering first question
  const handleStart = async () => {
    try {
      const response = await startSubmission(formId);
      if (response.success) {
        setSubmissionId(response.data.submissionId);
        setCsrfToken(response.data.csrfToken);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error('Error starting submission:', err);
      alert('Failed to start survey. Please try again.');
    }
  };

  // Auto-save answer (debounced)
  const handleAnswerChange = useCallback(
    async (questionId, questionText, value) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));

      if (!submissionId || !csrfToken) return;

      try {
        setSaving(true);
        await saveAnswer(submissionId, questionId, questionText, value, csrfToken);
      } catch (err) {
        console.error('Error saving answer:', err);
      } finally {
        setSaving(false);
      }
    },
    [submissionId, csrfToken]
  );

  // Navigate to next question
  const handleNext = async () => {
    const currentQuestion = form.questions[currentIndex];

    // Check if required question is answered
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      alert('This question is required');
      return;
    }

    // If last question, complete submission
    if (currentIndex === form.questions.length - 1) {
      await handleComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Go back to previous question
  const handleBack = () => {
    setCurrentIndex((prev) => Math.max(-1, prev - 1));
  };

  // Skip optional question
  const handleSkip = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  // Complete submission
  const handleComplete = async () => {
    try {
      await completeSubmission(submissionId, csrfToken);
      setCurrentIndex(form.questions.length); // Move to thank you screen
    } catch (err) {
      console.error('Error completing submission:', err);
      alert('Failed to submit survey. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-textSecondary">Loading...</div>
      </div>
    );
  }

  // Error state
  if (error || !form) {
    return <FormNotFound />;
  }

  // Welcome screen
  if (currentIndex === -1) {
    return <WelcomeScreen welcome={form.welcome} onStart={handleStart} />;
  }

  // Thank you screen
  if (currentIndex >= form.questions.length) {
    return <ThankYouScreen thankYou={form.thankYou} />;
  }

  // Question screen
  const currentQuestion = form.questions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col">
      <ProgressBar
        current={currentIndex + 1}
        total={form.questions.length}
      />

      <div className="flex-1 flex flex-col items-center justify-center py-12">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={form.questions.length}
            value={answers[currentQuestion.id]}
            onChange={(value) =>
              handleAnswerChange(currentQuestion.id, currentQuestion.text, value)
            }
            onSubmit={handleNext}
          />
        </AnimatePresence>

        <div className="w-full max-w-2xl px-6 mt-8">
          <NavigationButtons
            onBack={handleBack}
            onNext={handleNext}
            onSkip={handleSkip}
            canGoBack={currentIndex > 0}
            canSkip={!currentQuestion.required}
            nextLabel={
              currentIndex === form.questions.length - 1 ? 'Submit' : 'Next'
            }
            nextDisabled={currentQuestion.required && !answers[currentQuestion.id]}
          />
          <div className="text-sm text-textSecondary text-center mt-4 h-5">
            {saving && 'Saving...'}
          </div>
        </div>
      </div>
    </div>
  );
}
