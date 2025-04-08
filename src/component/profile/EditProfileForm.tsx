import React, { useState, useRef, useEffect } from "react";
import { UserBaseInfo } from "../../types/UserModel";
import UserInfoInput from "./UserInfoInput";
import { IconCamera, IconX } from "@tabler/icons-react";
import Instance from "../../interceptors/auth_interceptor";
import { useFileUploader } from "../form/FIleUploader";

const EditProfileForm: React.FC<{
  userInfo: UserBaseInfo;
  onClose: () => void;
  onSubmit: (data: Partial<UserBaseInfo>) => void; 
}> = ({ userInfo, onClose, onSubmit }) => {
  const instance = Instance();
  const [username, setUsername] = useState(userInfo.username || "");
  const [bio, setBio] = useState(userInfo.bio || "");
  const [avatarPreview, setAvatarPreview] = useState(userInfo.avatar || "");
  const [bgPreview, setBgPreview] = useState("/login_bg.svg");
  const [error, setError] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  // 头像上传逻辑
  const avatarUploader = useFileUploader({
    folder: "avatar",
    maxFiles: 1,
    allowedTypes: ["image/*"],
    getUploadToken: async ({ md5, fileName, fileType, folder }) => {
      const response = await instance.get("/api/file/token", {
        params: { md5, fileName, fileType, folder },
      });
      return response.data.data;
    },
  });

  // 背景图上传逻辑
  const bgUploader = useFileUploader({
    folder: "profile_bg",
    maxFiles: 1,
    allowedTypes: ["image/*"],
    getUploadToken: async ({ md5, fileName, fileType, folder }) => {
      const response = await instance.get("/api/file/token", {
        params: { md5, fileName, fileType, folder },
      });
      return response.data.data;
    },
  });

  useEffect(() => {
    // 合并错误信息
    const errors = [
      ...avatarUploader.uploadTasks,
      ...bgUploader.uploadTasks,
    ]
      .filter(t => t.status === "error")
      .map(t => t.error);

    if (errors.length > 0) {
      setError(errors.join("，"));
    }
  }, [avatarUploader.uploadTasks, bgUploader.uploadTasks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("用户名不能为空");
      return;
    }
  
    const isUploading = [
      ...avatarUploader.uploadTasks,
      ...bgUploader.uploadTasks,
    ].some(t => t.status === "pending" || t.status === "uploading");
  
    if (isUploading) {
      setError("请等待图片上传完成");
      return;
    }
  
    // 创建差异对象
    const updatedFields: Partial<UserBaseInfo> = {};
    
    updatedFields.id = userInfo.id;
    // 基础字段比较
    if (username.trim() !== userInfo.username) {
      updatedFields.username = username.trim();
    }
    if (bio.trim() !== userInfo.bio) {
      updatedFields.bio = bio.trim();
    }
  
    // 处理头像
    const avatarKey = avatarUploader.uploadTasks.find(
      t => t.status === "success"
    )?.key?.trim();
    if (avatarKey && avatarKey !== userInfo.avatar) {
      updatedFields.avatar = avatarKey;
    }
  
    // 处理背景图
    const bgImageKey = bgUploader.uploadTasks.find(
      t => t.status === "success"
    )?.key?.trim();
    if (bgImageKey && bgImageKey !== userInfo.profile_background) {
      updatedFields.profile_background = bgImageKey;
    }
  
    // 如果没有修改任何字段
    if (Object.keys(updatedFields).length === 0) {
      onClose();
      return;
    }
  
    onSubmit(updatedFields);
    onClose();
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "bg"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 生成预览图
    const reader = new FileReader();
    reader.onloadend = () => {
      type === "avatar"
        ? setAvatarPreview(reader.result as string)
        : setBgPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 获取对应的上传器
    const uploader = type === "avatar" ? avatarUploader : bgUploader;
    
    // 清除旧任务
    uploader.uploadTasks.forEach(t => uploader.removeUploadTask(t.id));
    
    // 创建新上传任务
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    uploader.handleFileChange(dataTransfer.files);
  };

  return (
    <div className="relative w-full max-w-3xl px-4 overflow-y-auto scroll-container max-h-[90vh]">
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-xl rounded-lg z-10 relative">
          {/* 头部和关闭按钮保持不变 */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20 text-xl font-semibold text-gray-800 p-4 bg-white rounded-t-lg w-full text-center">
            编辑个人资料
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="关闭"
          >
            <IconX size={24} />
          </button>

          <div className="relative mb-6">
            {/* 背景图上传区域 */}
            <div className="group relative w-full h-48 bg-cover bg-center rounded-t-lg overflow-hidden">
              <img
                alt="背景图"
                src={userInfo.profile_background || bgPreview}
                className="w-full h-full object-cover"
              />
              <input
                type="file"
                ref={bgInputRef}
                accept="image/*"
                onChange={(e) => handleImageChange(e, "bg")}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => bgInputRef.current?.click()}
                className="absolute inset-0 w-full h-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <IconCamera size={30} className="text-white" />
                {bgUploader.uploadTasks[0]?.status === "uploading" && (
                  <div className="absolute bottom-2 left-2 text-white text-sm">
                    上传中 {Math.round(bgUploader.uploadTasks[0].progress)}%
                  </div>
                )}
              </button>
            </div>

            {/* 头像上传区域 */}
            <div className="absolute left-24 -translate-x-20 -translate-y-1/2">
              <div className="relative group w-32 h-32 bg-white rounded-full overflow-hidden shadow-lg border-4 border-white">
                <img
                  alt="头像"
                  src={avatarPreview || "/static/images/avatar/1.jpg"}
                  className="w-full h-full object-cover"
                />
                <input
                  type="file"
                  ref={avatarInputRef}
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "avatar")}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 w-full h-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <IconCamera size={30} className="text-white" />
                  {avatarUploader.uploadTasks[0]?.status === "uploading" && (
                    <div className="absolute bottom-2 left-2 text-white text-sm">
                      上传中 {Math.round(avatarUploader.uploadTasks[0].progress)}%
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 pb-8 space-y-6 mt-20">
            {error && <div className="text-red-500 text-sm -mt-4">{error}</div>}

            <UserInfoInput
              id="username"
              label="用户名"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
            />

            <UserInfoInput
              id="bio"
              label="个人简介"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                保存更改
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;