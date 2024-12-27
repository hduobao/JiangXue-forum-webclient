import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { UserBaseInfo } from "../../types/UserModel";
import { IconBalloon, IconCalendarWeek } from "@tabler/icons-react";
import OtherProfileButtonGroup from "./OtherProfileButtonGroup";
import MyProfileButtonGroup from "./MyprofileButtonGroup";

const UserSpaceInfoCard: React.FC<{ userInfo: UserBaseInfo, isOwnProfile: boolean }> = ({
  userInfo, isOwnProfile
}) => {
  const [modalData, setModalData] = useState<{
    type: "avatar" | "bg" | null;
    src: string;
  } | null>(null);

  const handleImageClick = (type: "avatar" | "bg", src: string) => {
    setModalData({ type, src });
  };

  const handleCloseModal = () => {
    setModalData(null);
  };

  const formatDate = (dateString: string, type: "birthday" | "createdAt") => {
    const date = new Date(dateString);

    if (type === "birthday") {
      const month = date.getMonth() + 1; // getMonth() 返回的是 0-11，所以需要加 1
      const day = date.getDate();
      return `${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    }

    if (type === "createdAt") {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    return "";
  };

  return (
    <div className="w-full max-w-3xl px-4 overflow-y-scroll scroll-container">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="relative mb-6">
          {/* 背景图 */}
          <div className="w-full h-48 bg-cover bg-center rounded-t-lg">
            <img
              alt="User BG"
              src={"/login_bg.svg"}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => handleImageClick("bg", "/login_bg.svg")}
            />
          </div>

          {/* 头像 */}
          <div className="absolute left-24 transform -translate-x-20 -translate-y-1/2 w-32 h-32 bg-white rounded-full overflow-hidden shadow-lg border-4 border-white">
            <img
              alt="User Avatar"
              src={userInfo.avatar || "/static/images/avatar/1.jpg"}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() =>
                handleImageClick(
                  "avatar",
                  userInfo.avatar || "/static/images/avatar/1.jpg"
                )
              }
            />
          </div>
          {isOwnProfile ? <MyProfileButtonGroup /> : <OtherProfileButtonGroup />}
        </div>

        {/* 用户名和位置 */}
        <div className="ml-6 mb-6 mt-20 space-y-2">
          <h1 className="text-xl font-semibold">{userInfo.username}</h1>
          <p className="text-sm text-gray-500">@{userInfo.account}</p>{" "}
          <p className="text-black-600">
            {userInfo.bio || "该用户没有填写个人简介"}
          </p>
          <div className="flex items-center space-x-4">
            <p className="flex items-center space-x-2">
              <IconBalloon className="text-lg" />
              <span className="text-gray-500">
                生日{" "}
                {userInfo.birthday
                  ? formatDate(userInfo.birthday, "birthday")
                  : "未填写生日"}
              </span>
            </p>

            <p className="flex items-center space-x-2">
              <IconCalendarWeek className="text-lg" />
              <span className="text-gray-500">
                注册日期{" "}
                {userInfo.created_at
                  ? formatDate(userInfo.created_at, "createdAt")
                  : "未填写注册日期"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {modalData && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={handleCloseModal}
          ></div>
          <div className="bg-white p-4 rounded-lg shadow-lg z-10 max-w-screen-sm max-h-screen overflow-auto">
            <img
              alt={
                modalData.type === "avatar"
                  ? "Enlarged Avatar"
                  : "Enlarged Background"
              }
              src={modalData.src}
              className="w-auto h-auto max-w-full max-h-screen object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSpaceInfoCard;
