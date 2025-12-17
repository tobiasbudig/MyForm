import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getForm, startSubmission, saveAnswer, completeSubmission } from '../utils/api';
import { trackPageView, trackQuestionView } from '../utils/tracker';
import ProgressBar from '../components/ProgressBar';
import WelcomeScreen from '../components/WelcomeScreen';
import QuestionCard from '../components/QuestionCard';
import NavigationButtons from '../components/NavigationButtons';
import ThankYouScreen from '../components/ThankYouScreen';
import FormNotFound from '../components/FormNotFound';
import FixedFooter from '../components/FixedFooter';

export default function FormPage() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 = welcome screen
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Use ref for synchronous access to latest answers (fixes async state issue in auto-advance)
  const answersRef = useRef({});

  // Sync ref with state immediately on every render
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  /**
   * Check if answer matches the show_when condition
   */
  const matchesCondition = useCallback((questionType, answer, showWhen) => {
    if (questionType === 'single_choice') {
      // Exact match OR prefix match for "Other: custom text"
      if (showWhen === 'Other' && typeof answer === 'string') {
        return answer === 'Other' || answer.startsWith('Other: ');
      }
      return answer === showWhen;
    }

    if (questionType === 'multiple_choice') {
      // Array contains match with "Other" prefix handling
      if (!Array.isArray(answer)) return false;

      if (showWhen === 'Other') {
        return answer.some(item => item === 'Other' || item.startsWith('Other: '));
      }
      return answer.includes(showWhen);
    }

    // For text fields, likert, NPS: exact match
    return String(answer) === String(showWhen);
  }, []);

  /**
   * Determines if a question should be visible based on its dependencies
   */
  const isQuestionVisible = useCallback((question, answers, allQuestions) => {
    // No dependency = always visible
    if (!question.depends_on || !question.show_when) {
      return true;
    }

    // Find the dependency question
    const dependencyQuestion = allQuestions.find(q => q.id === question.depends_on);

    // Invalid dependency ID = hide question (fail-safe)
    if (!dependencyQuestion) {
      return false;
    }

    // No answer to dependency = hide dependent question
    const dependencyAnswer = answers[question.depends_on];
    if (dependencyAnswer === undefined || dependencyAnswer === null || dependencyAnswer === '') {
      return false;
    }

    // Match logic based on dependency question type
    const result = matchesCondition(dependencyQuestion.type, dependencyAnswer, question.show_when);
    return result;
  }, [matchesCondition]);

  /**
   * Memoize visible questions to avoid recalculating on every render
   */
  const visibleQuestions = useMemo(() => {
    if (!form?.questions) return [];
    return form.questions.filter(q => isQuestionVisible(q, answers, form.questions));
  }, [form?.questions, answers, isQuestionVisible]);

  /**
   * Calculate current position among visible questions
   */
  const currentVisibleIndex = useMemo(() => {
    if (currentIndex < 0) return 0;
    if (!form?.questions) return 0;
    const visibleBeforeCurrent = form.questions
      .slice(0, currentIndex + 1)
      .filter(q => isQuestionVisible(q, answers, form.questions))
      .length;
    return visibleBeforeCurrent;
  }, [form?.questions, currentIndex, answers, isQuestionVisible]);

  // Load form configuration
  useEffect(() => {
    async function loadForm() {
      try {
        setLoading(true);
        const response = await getForm(formId);
        if (response.success) {
          setForm(response.data);
          // Track page view when form loads successfully
          trackPageView(formId);
        } else {
          setError('Form not found');
        }
      } catch (err) {
        setError('Form not found');
      } finally {
        setLoading(false);
      }
    }

    loadForm();
  }, [formId]);

  // Detect circular dependencies on form load
  useEffect(() => {
    if (!form?.questions) return;

    const detectCircular = (questionId, visited = new Set(), path = []) => {
      if (visited.has(questionId)) {
        return true;
      }

      const question = form.questions.find(q => q.id === questionId);
      if (!question?.depends_on) return false;

      return detectCircular(
        question.depends_on,
        new Set([...visited, questionId]),
        [...path, questionId]
      );
    };

    form.questions.forEach(q => {
      if (q.depends_on) detectCircular(q.id);
    });
  }, [form]);

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
      toast.error('Umfrage konnte nicht gestartet werden. Bitte versuchen Sie es erneut.');
    }
  };

  // Handle comment change (with auto-save)
  const handleCommentChange = useCallback(
    async (questionId, commentText) => {
      setComments((prev) => ({ ...prev, [questionId]: commentText }));

      // Auto-save comment if we have an answer for this question
      if (!submissionId || !csrfToken) return;

      const questionAnswer = answers[questionId];
      if (questionAnswer !== undefined) {
        try {
          setSaving(true);
          const currentQuestion = form.questions.find((q) => q.id === questionId);
          await saveAnswer(
            submissionId,
            questionId,
            currentQuestion?.text || '',
            questionAnswer,
            commentText || null,
            csrfToken
          );
        } catch (err) {
          console.error('Error saving comment:', err);
          toast.error('Kommentar konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.');
        } finally {
          setSaving(false);
        }
      }
    },
    [submissionId, csrfToken, answers, form]
  );

  // Auto-save answer (debounced)
  const handleAnswerChange = useCallback(
    async (questionId, questionText, value) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
      answersRef.current = { ...answersRef.current, [questionId]: value };

      if (!submissionId || !csrfToken) return;

      try {
        setSaving(true);
        const comment = comments[questionId] || null;
        await saveAnswer(submissionId, questionId, questionText, value, comment, csrfToken);
      } catch (err) {
        console.error('Error saving answer:', err);
        toast.error('Antwort konnte nicht gespeichert werden. Ihre Eingabe wird bei der nächsten Änderung erneut versucht.');
        // Keep the answer in state for retry on next change
      } finally {
        setSaving(false);
      }
    },
    [submissionId, csrfToken, comments]
  );

  // Find next visible question index
  const getNextVisibleIndex = useCallback((currentIdx) => {
    const latestAnswers = answersRef.current; // Use ref for synchronous access
    for (let i = currentIdx + 1; i < form.questions.length; i++) {
      const question = form.questions[i];
      const visible = isQuestionVisible(question, latestAnswers, form.questions);
      if (visible) {
        return i;
      }
    }
    return form.questions.length; // No more questions
  }, [form?.questions, isQuestionVisible]);

  // Find previous visible question index
  const getPreviousVisibleIndex = useCallback((currentIdx) => {
    const latestAnswers = answersRef.current; // Use ref for synchronous access
    for (let i = currentIdx - 1; i >= 0; i--) {
      const question = form.questions[i];
      if (isQuestionVisible(question, latestAnswers, form.questions)) {
        return i;
      }
    }
    return -1; // Welcome screen
  }, [form?.questions, isQuestionVisible]);

  // Handle answer changes that affect visibility
  useEffect(() => {
    if (currentIndex < 0 || !form?.questions) return;

    const currentQuestion = form.questions[currentIndex];
    if (!currentQuestion) return;

    const latestAnswers = answersRef.current; // Use ref for synchronous access
    // Check if current question is still visible
    if (!isQuestionVisible(currentQuestion, latestAnswers, form.questions)) {
      // Current question became hidden - jump to next visible
      const nextIndex = getNextVisibleIndex(currentIndex);
      setCurrentIndex(nextIndex);
    }
  }, [answers, currentIndex, form?.questions, isQuestionVisible, getNextVisibleIndex]);

  // Track question views
  useEffect(() => {
    if (currentIndex >= 0 && form?.questions && currentIndex < form.questions.length) {
      const currentQuestion = form.questions[currentIndex];
      trackQuestionView(formId, currentVisibleIndex, currentQuestion.id);
    }
  }, [currentIndex, formId, currentVisibleIndex, form?.questions]);

  // Navigate to next question
  const handleNext = async () => {
    const currentQuestion = form.questions[currentIndex];

    // Validation
    if (currentQuestion.required && !answersRef.current[currentQuestion.id]) {
      toast.error('Diese Frage ist erforderlich');
      return;
    }

    const nextIndex = getNextVisibleIndex(currentIndex);

    if (nextIndex >= form.questions.length) {
      await handleComplete();
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  // Go back to previous question
  const handleBack = () => {
    const prevIndex = getPreviousVisibleIndex(currentIndex);
    setCurrentIndex(prevIndex);
  };

  // Skip optional question
  const handleSkip = () => {
    const nextIndex = getNextVisibleIndex(currentIndex);
    setCurrentIndex(nextIndex >= form.questions.length ? form.questions.length : nextIndex);
  };

  // Complete submission
  const handleComplete = async () => {
    try {
      await completeSubmission(submissionId, csrfToken);
      setCurrentIndex(form.questions.length); // Move to thank you screen
    } catch (err) {
      toast.error('Umfrage konnte nicht übermittelt werden. Bitte versuchen Sie es erneut.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-textSecondary">Lädt...</div>
      </div>
    );
  }

  // Error state
  if (error || !form) {
    return <FormNotFound />;
  }

  // Welcome screen
  if (currentIndex === -1) {
    return <WelcomeScreen welcome={form.welcome} onStart={handleStart} formId={formId} />;
  }

  // Thank you screen
  if (currentIndex >= form.questions.length) {
    return <ThankYouScreen thankYou={form.thankYou} formId={formId} />;
  }

  // Question screen
  const currentQuestion = form.questions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col">
      <ProgressBar
        current={currentVisibleIndex}
        total={visibleQuestions.length}
      />

      <div className="flex flex-col items-center py-6 md:py-12">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            questionNumber={currentVisibleIndex}
            totalQuestions={visibleQuestions.length}
            value={answers[currentQuestion.id]}
            onChange={(value) =>
              handleAnswerChange(currentQuestion.id, currentQuestion.text, value)
            }
            onSubmit={handleNext}
            comment={comments[currentQuestion.id]}
            onCommentChange={(commentText) =>
              handleCommentChange(currentQuestion.id, commentText)
            }
          />
        </AnimatePresence>

        <div className="w-full max-w-2xl px-6 mt-2 md:mt-4 flex-shrink-0">
          <NavigationButtons
            onBack={handleBack}
            onNext={handleNext}
            onSkip={handleSkip}
            canGoBack={currentIndex > 0}
            canSkip={!currentQuestion.required}
            nextLabel={
              currentIndex === form.questions.length - 1 ? 'Absenden' : 'Weiter'
            }
            nextDisabled={currentQuestion.required && !answers[currentQuestion.id]}
          />
        </div>
      </div>
      <FixedFooter />
    </div>
  );
}
