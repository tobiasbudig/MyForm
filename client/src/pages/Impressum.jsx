import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import impressumContent from '../content/impressum.md?raw';

export default function Impressum() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-screen px-6 py-12"
    >
      <div className="max-w-3xl w-full">
        <div className="prose prose-lg max-w-none prose-headings:text-textPrimary prose-p:text-textSecondary prose-a:text-primary hover:prose-a:text-primary-hover">
          <Markdown>{impressumContent}</Markdown>
        </div>

        <Link
          to="/"
          className="inline-block mt-12 text-primary hover:text-primary-hover transition-default"
        >
          ← Zurück zur Startseite
        </Link>
      </div>
    </motion.div>
  );
}
