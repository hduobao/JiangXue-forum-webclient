import {
  IconMessagePlus,
  IconUserPlus,
  IconUsersPlus,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Instance from "../../interceptors/auth_interceptor";
import { UserFans } from "../../types/UserModel";
import FanListModal from "../panels/FansModal";
import CreateGroupModal from "../panels/CreateGroupModal";

const MessagePlusButton: React.FC = () => {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [showFanList, setShowFanList] = useState(false);
  const [fans, setFans] = useState<UserFans[]>([]);
  const [loadingFans, setLoadingFans] = useState(false);
  const [error, setError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupUsers, setGroupUsers] = useState<UserFans[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [groupError, setGroupError] = useState("");
  const navigate = useNavigate();
  const instance = Instance();

  // 点击外部关闭逻辑
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targets = [menuRef.current, buttonRef.current];
      if (!targets.some((t) => t?.contains(event.target as Node))) {
        setIsCreateMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 获取粉丝列表
  const fetchFans = async () => {
    try {
      setLoadingFans(true);
      setError("");
      const response = await instance.get("/api/me/fans");
      setFans(response.data.data || []);
    } catch (err) {
      setError("获取粉丝列表失败，请稍后重试");
      console.error("Fetch fans error:", err);
    } finally {
      setLoadingFans(false);
    }
  };

  const handleNewMessageClick = () => {
    setShowFanList(true);
    fetchFans();
    setIsCreateMenuOpen(false);
  };

  const fetchGroupUsers = async () => {
    try {
      setLoadingUsers(true);
      setGroupError("");
      const response = await instance.get("/api/me/fans"); // 根据实际API调整
      setGroupUsers(response.data.data || []);
    } catch (err) {
      setGroupError("获取用户列表失败");
    } finally {
      setLoadingUsers(false);
    }
  };

  // 修正：创建群组按钮点击处理
  const handleCreateGroupClick = () => {
    setShowCreateGroup(true);
    fetchGroupUsers(); // 获取可选用户列表
    setIsCreateMenuOpen(false);
  };

  const handleCreateGroup = async (name: string, members: number[]) => {
    try {
      await instance.post("/api/users/group", {
        group_name: name,
        members,
      });
      setShowCreateGroup(false);
    //   navigate("/message/groups");
    } catch (err) {
      setGroupError("创建群组失败");
    }
  };

  const handleStartChat = (userId: number) => {
    navigate(`/message/private/${userId}`);
    setShowFanList(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* 悬浮按钮 */}
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
          className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center 
            shadow-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-xl
            active:scale-95"
        >
          <IconMessagePlus className="text-white w-6 h-6" />
        </button>

        {/* 创建菜单 */}
        {isCreateMenuOpen && (
          <div
            ref={menuRef}
            className="absolute bottom-20 right-0 w-48 bg-white rounded-lg shadow-xl
              border border-gray-100 animate-fade-in-up"
          >
            <button
              onClick={handleNewMessageClick}
              className="w-full px-4 py-3 flex items-center hover:bg-gray-50
                text-sm text-gray-700"
            >
              <IconUserPlus className="w-5 h-5 mr-3 text-blue-600" />
              发起私信
            </button>
            <button
              onClick={handleCreateGroupClick}
              className="w-full px-4 py-3 flex items-center hover:bg-gray-50
                text-sm text-gray-700 border-t border-gray-100"
            >
              <IconUsersPlus className="w-5 h-5 mr-3 text-green-600" />
              创建群聊
            </button>
          </div>
        )}
      </div>

      <FanListModal
        isOpen={showFanList}
        onClose={() => setShowFanList(false)}
        fans={fans}
        loading={loadingFans}
        error={error}
        onSelect={handleStartChat}
      />

      <CreateGroupModal
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        users={groupUsers}
        loading={loadingUsers}
        error={groupError}
        onCreate={handleCreateGroup}
      />
    </div>
  );
};

export default MessagePlusButton;
