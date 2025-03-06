import { useRef } from "react";
import { IconPhoto, IconTrash } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { UploadTask } from "./FIleUploader";

interface UploadZoneProps {
  tasks: UploadTask[];
  onFileChange: (files: FileList | null) => void;
  onRemove: (id: string) => void;
  maxFiles?: number;
}

export const UploadZone = ({
  tasks,
  onFileChange,
  onRemove,
  maxFiles = 4,
}: UploadZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (tasks.length < maxFiles) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      className="border-2 border-dashed rounded-lg p-4 relative cursor-pointer"
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        multiple
        onChange={(e) => onFileChange(e.target.files)}
        className="hidden"
        accept="image/*,video/*"
      />

      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <IconPhoto className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p className="text-gray-600">点击选择文件</p>
          <p className="text-sm text-gray-500">最多{maxFiles}个文件</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {tasks.map((task) => (
            <div key={task.id} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {task.file.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(task.file)}
                    alt="预览"
                    className="w-full h-full object-cover"
                  />
                )}
                {task.file.type.startsWith("video/") && (
                  <video className="w-full h-full object-cover">
                    <source src={URL.createObjectURL(task.file)} />
                  </video>
                )}
              </div>

              {/* 上传状态 */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                {task.status === "uploading" && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-8 w-8 border-2 border-white border-t-transparent rounded-full"
                  />
                )}
                {task.status === "error" && (
                  <span className="text-red-500 text-sm">上传失败</span>
                )}
              </div>

              {/* 删除按钮 */}
              <button
                className="absolute top-1 right-1 p-1 bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(task.id);
                }}
              >
                <IconTrash className="w-4 h-4 text-white" />
              </button>

              {/* 进度条 */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};