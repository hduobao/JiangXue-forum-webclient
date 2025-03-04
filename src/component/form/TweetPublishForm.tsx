import { Fragment, useState, useRef, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import { 
  IconX, 
  IconPhoto, 
  IconChartBar, 
  IconMapPin, 
  IconMoodSmile, 
  IconCalendar
} from "@tabler/icons-react";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAvatar: string;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, userAvatar }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setText('');
    setIsSubmitting(false);
    onClose();
  };

  const iconButtonClass = "text-blue-500 hover:bg-blue-50 rounded-full p-2 transition-colors duration-200";

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                  >
                    <IconX className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!text.trim() || isSubmitting}
                    className={`px-4 py-1.5 rounded-full font-bold text-white ${
                      !text.trim() || isSubmitting
                        ? 'bg-blue-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } transition-colors`}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      '发布'
                    )}
                  </button>
                </div>

                <div className="flex gap-3">
                  <img
                    src={userAvatar}
                    alt="User avatar"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="mb-2">
                      <button className="text-sm font-semibold text-blue-500 border border-blue-500 rounded-full px-3 py-0.5 hover:bg-blue-50 transition-colors">
                        所有人可评论
                      </button>
                    </div>
                    <TextareaAutosize
                      ref={textareaRef}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="分享一下"
                      className="w-full resize-none text-xl outline-none mb-4"
                      minRows={3}
                      maxRows={12}
                    />
                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                      <div className="flex space-x-1">
                        <button className={iconButtonClass}>
                          <IconPhoto className="h-5 w-5" />
                        </button>
                        <button className={iconButtonClass}>
                          <IconChartBar className="h-5 w-5" />
                        </button>
                        <button className={iconButtonClass}>
                          <IconMoodSmile className="h-5 w-5" />
                        </button>
                        <button className={iconButtonClass}>
                          <IconMapPin className="h-5 w-5" />
                        </button>
                        <button className={iconButtonClass}>
                          <IconCalendar className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex items-center">
                        {text.length > 0 && (
                          <motion.div 
                            className="relative mr-3 h-7 w-7"
                            initial={false}
                          >
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              style={{
                                background: `conic-gradient(#1d9bf0 ${Math.min(text.length / 280, 1) * 100}%, transparent 0)`,
                                opacity: text.length > 260 ? 1 : 0.5
                              }}
                            />
                            <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                              <span className={`text-xs font-semibold ${
                                text.length > 280 ? 'text-red-500' : 
                                text.length > 260 ? 'text-yellow-500' : 'text-gray-500'
                              }`}>
                                {280 - text.length}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PostModal;
