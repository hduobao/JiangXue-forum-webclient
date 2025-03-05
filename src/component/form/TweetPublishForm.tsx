import { Fragment, useState, useRef, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import { IconX, IconPhoto, IconChartBar, IconMapPin, IconMoodSmile, IconCalendar, IconTrash } from "@tabler/icons-react";
import Instance from '../../interceptors/auth_interceptor';
import { Navigate, useNavigate } from 'react-router-dom';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAvatar: string;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, userAvatar }) => {
  const instance = Instance()
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...fileArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!text.trim() && selectedFiles.length === 0) return;
  
    setIsSubmitting(true);
    let uploadedFiles = [];
  
    try {
      // 仅当有文件时才触发上传
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });

        const uploadResponse = await instance.post("/api/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
        if (uploadResponse.status !== 200) {
          throw new Error("上传失败");
        }
  
        uploadedFiles = uploadResponse.data.data;
      }
  
      // 触发发布接口
      await instance.post('/api/tweets', {
        title: "aaa",
        content: text,
        forum_id: 1,
        file_ids: uploadedFiles, // 仅当有上传文件时才传递
      });
  
      setText('');
      setSelectedFiles([]);
      onClose();

      navigate(0)
    } catch (error) {
      console.error("发布失败:", error);
    } finally {
      setIsSubmitting(false);
    }
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
                    disabled={(!text.trim() && selectedFiles.length === 0) || isSubmitting}
                    className={`px-4 py-1.5 rounded-full font-bold text-white ${
                      (!text.trim() && selectedFiles.length === 0) || isSubmitting
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
                    <TextareaAutosize
                      ref={textareaRef}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="分享一下"
                      className="w-full resize-none text-xl outline-none mb-4"
                      minRows={3}
                      maxRows={12}
                    />

                    {selectedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Preview"
                              className="w-[150px] h-[150px] object-cover rounded-md"
                            />
                            <button
                              onClick={() => handleRemoveFile(index)}
                              className="absolute top-0 right-0 bg-gray-800 text-white p-1 rounded-full"
                            >
                              <IconTrash className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                      <div className="flex space-x-1">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={handleFileChange}
                          multiple
                        />
                        <button
                          className={iconButtonClass}
                          onClick={() => fileInputRef.current?.click()}
                        >
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
function refreshUser() {
  throw new Error('Function not implemented.');
}

