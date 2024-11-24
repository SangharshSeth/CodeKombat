import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OpponentCodeModalProps {
  code: string;
  isOpen: boolean;
  onClose: () => void;
}

const OpponentCodeModal = ({ code, isOpen, onClose }: OpponentCodeModalProps) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="relative w-[90%] max-w-3xl max-h-[80vh] bg-zinc-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl overflow-hidden"
          >

            {/* Code Content */}
            <pre className="p-4 overflow-auto max-h-[calc(80vh-4rem)] bg-transparent text-white font-fira-code">
              <code>{code}</code>
            </pre>

            {/* Timer Bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 15, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-gray-500"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OpponentCodeModal; 