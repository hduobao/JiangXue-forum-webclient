import { Fragment, useState, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import TextareaAutosize from "react-textarea-autosize";
import {
  IconX,
  IconPhoto,
  IconChartBar,
  IconMapPin,
  IconMoodSmile,
  IconCalendar,
} from "@tabler/icons-react";
import Instance from "../../interceptors/auth_interceptor";
import { useNavigate } from "react-router-dom";
import { useFileUploader } from "./FIleUploader";
import { UploadZone } from "./UploadZone";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAvatar: string;
}

const PostModal: React.FC<PostModalProps> = ({
  isOpen,
  onClose,
  userAvatar,
}) => {
  const instance = Instance();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // 用于触发文件选择

  // 使用上传组件逻辑
  const { uploadTasks, handleFileChange, removeUploadTask } = useFileUploader({
    folder: "tweet",
    maxFiles: 4,
    allowedTypes: ["image/*", "video/*"],
    getUploadToken: async ({ md5, fileName, fileType, folder }) => {
      const response = await instance.get("/api/file/token", {
        params: { md5, fileName, fileType, folder },
      });
      return response.data.data;
    },
  });

  const handleRemoveFile = (id: string) => {
    removeUploadTask(id); // 调用删除方法
  };

  const handleSubmit = async () => {
    if (!text.trim() && uploadTasks.length === 0) return;

    // 检查是否有未完成的上传任务
    const hasUnfinished = uploadTasks.some(
      (task) => task.status !== "success" && task.status !== "error"
    );

    if (hasUnfinished) {
      alert("请等待文件上传完成");
      return;
    }

    setIsSubmitting(true);

    try {
      // 获取所有成功上传的文件 key
      const fileKeys = uploadTasks
        .filter((task) => task.status === "success")
        .map((task) => task.key) as string[];

      // 提交推文内容
      await instance.post("/api/tweets", {
        title: "aaa",
        content: text,
        forum_id: 1,
        file_keys: fileKeys,
      });

      // 重置状态
      setText("");
      onClose();
      navigate(0);
    } catch (error) {
      console.error("发布失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 触发文件选择
  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 触发隐藏的文件输入框
    }
  };

  // 处理文件选择
  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFileChange(files); // 将文件传递给上传逻辑
    }
  };

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const iconButtonClass =
    "text-blue-500 hover:bg-blue-50 rounded-full p-2 transition-colors duration-200";

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
                    disabled={
                      (!text.trim() && uploadTasks.length === 0) || isSubmitting
                    }
                    className={`px-4 py-1.5 rounded-full font-bold text-white ${
                      (!text.trim() && uploadTasks.length === 0) || isSubmitting
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    } transition-colors`}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      "发布"
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

                    <div className="mb-4">
                      <UploadZone
                        tasks={uploadTasks}
                        onFileChange={handleFileChange}
                        onRemove={handleRemoveFile}
                        maxFiles={4}
                      />
                    </div>

                    {/* 隐藏的文件输入框 */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={onFileInputChange}
                      accept="image/*,video/*"
                      multiple
                    />

                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                      <div className="flex space-x-1">
                        <button
                          className={iconButtonClass}
                          onClick={handleFileSelect} // 触发文件选择
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