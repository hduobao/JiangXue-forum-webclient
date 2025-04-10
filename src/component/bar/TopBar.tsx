import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";
import SearchForm from "../form/SearchForm";

const TopBar: React.FC<{ 
  page: string; 
  activeTab?: string; 
  setActiveTab?: React.Dispatch<React.SetStateAction<string>> 
  onSearch?: (query: string) => void;
}> = ({ page, activeTab = '', setActiveTab = () => {}, onSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  // 判断是否在详情页
  const isHomePage = location.pathname.includes("/home");
  const isExplorePage = location.pathname.includes("/explore");

  return (
    <div className="relative flex flex-col">
      <div className="flex">
        {isHomePage ? (
          <>
            <button
              className={`flex-grow text-center cursor-pointer p-4 transition-colors duration-200 ${activeTab === "recommendations" ? "font-bold" : "text-gray-700 hover:bg-gray-200"}`}
              onClick={() => handleTabClick("recommendations")}
              style={{ fontSize: "1.1rem" }} // 字体调整
            >
              推荐
            </button>
            <button
              className={`flex-grow text-center cursor-pointer p-4 transition-colors duration-200 ${activeTab === "following" ? "font-bold" : "text-gray-700 hover:bg-gray-200"}`}
              onClick={() => handleTabClick("following")}
              style={{ fontSize: "1.1rem" }} // 字体调整
            >
              关注
            </button>
          </>
        ) : isExplorePage ? (
          // 搜索框居中的样式
          <div className="flex justify-center items-center w-full p-4">
            <SearchForm width="500px" searchContent={page} onSearch={onSearch} />
          </div>
        ) : (
          // 返回按钮
          <button
            className="flex items-center cursor-pointer p-4 transition-colors duration-200 text-gray-700"
            onClick={() => navigate(-1)} // 返回上一个页面
          >
            <IconArrowLeft />
            <span className="ml-4 text-black-500 text-2xl font-bold">
              {page}
            </span>
          </button>
        )}
      </div>

      {/* 蓝色横线指示激活的标签 */}
      {isHomePage && (
        <div
          className="h-1 bg-blue-500 transition-all duration-300"
          style={{
            width: "50%",
            marginLeft: activeTab === "recommendations" ? "0%" : "50%",
          }}
        />
      )}
    </div>
  );
};

export default TopBar;
