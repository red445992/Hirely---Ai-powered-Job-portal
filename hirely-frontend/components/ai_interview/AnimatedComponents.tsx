import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

interface AnimatedOptionProps {
  option: string;
  index: number;
  isSelected: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  showFeedback: boolean;
  onClick: () => void;
}

export function AnimatedQuizOption({
  option,
  index,
  isSelected,
  isCorrect,
  isWrong,
  showFeedback,
  onClick,
}: AnimatedOptionProps) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={showFeedback}
      className={`
        w-full p-4 text-left rounded-xl border-2 transition-all
        ${
          isSelected && !showFeedback
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-blue-300'
        }
        ${isCorrect ? 'border-green-500 bg-green-50' : ''}
        ${isWrong ? 'border-red-500 bg-red-50' : ''}
        ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{option}</span>
        {showFeedback && isCorrect && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </motion.div>
        )}
        {showFeedback && isWrong && (
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <XCircle className="w-6 h-6 text-red-600" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

interface AnimatedProgressBarProps {
  progress: number;
}

export function AnimatedProgressBar({ progress }: AnimatedProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative"
      >
        <motion.div
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      </motion.div>
    </div>
  );
}

interface AnimatedScoreCardProps {
  score: number;
  passed: boolean;
}

export function AnimatedScoreCard({ score, passed }: AnimatedScoreCardProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
      className={`
        p-8 rounded-2xl text-center
        ${
          passed
            ? 'bg-gradient-to-br from-green-50 to-emerald-100'
            : 'bg-gradient-to-br from-orange-50 to-red-100'
        }
      `}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 150 }}
        className="text-6xl font-bold mb-4"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className={passed ? 'text-green-600' : 'text-orange-600'}
        >
          {score.toFixed(0)}%
        </motion.span>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <p className="text-xl font-semibold">
          {passed ? '🎉 Congratulations!' : '💪 Keep Practicing!'}
        </p>
        <p className="text-gray-600 mt-2">
          {passed ? 'You passed the quiz!' : 'You can do better next time!'}
        </p>
      </motion.div>
    </motion.div>
  );
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
