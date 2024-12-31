import React, { useState } from "react";
import { UserBaseInfo } from "../../types/UserModel";
import UserInfoInput from "./UserInfoInput";
import UserInfoTextArea from "./UserInfoTextArea";
import { IconCamera } from "@tabler/icons-react";

const EditProfileForm: React.FC<{
  userInfo: UserBaseInfo;
  onClose: () => void; // 关闭弹窗的函数
}> = ({ userInfo, onClose }) => {
  const [username, setUsername] = useState(userInfo.username || "");
  const [bio, setBio] = useState(userInfo.bio || "");

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(event.target.value);
  };

  return (
    <div className="relative w-full max-w-3xl px-4 overflow-y-scroll scroll-container">
      {/* 去掉了遮罩部分 */}

      <div className="bg-white shadow-lg rounded-lg z-10 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20 text-xl font-semibold text-gray-800 p-4 bg-white rounded-t-lg w-full text-center">
          编辑个人资料
        </div>

        <div className="relative mb-6">
          {/* 背景图 */}
          <div className="w-full h-48 bg-cover bg-center rounded-t-lg relative">
            <img
              alt="User BG"
              src={"/login_bg.svg"}
              className="w-full h-full object-cover"
            />
            {/* 相机图标在背景图正中间 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <IconCamera size={30} color="#fff" />
            </div>
          </div>

          {/* 头像 */}
          <div className="absolute left-24 transform -translate-x-20 -translate-y-1/2 w-32 h-32 bg-white rounded-full overflow-hidden shadow-lg border-4 border-white relative">
            <img
              alt="User Avatar"
              src={userInfo.avatar || "/static/images/avatar/1.jpg"}
              className="w-full h-full object-cover cursor-pointer"
            />
            {/* 相机图标在头像正中间 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <IconCamera size={30} color="#000" />
            </div>
          </div>
        </div>

        <div className="ml-6 mb-6 mt-20 space-y-6">
          <UserInfoInput
            id="username"
            label="用户名"
            value={username}
            onChange={handleUsernameChange}
          />

          {/* 个人简介输入框 */}
          <UserInfoTextArea
            id="bio"
            label="个人简介"
            value={bio}
            onChange={handleBioChange}
          />
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default EditProfileForm;
