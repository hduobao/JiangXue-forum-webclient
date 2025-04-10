import { useState } from "react";
import BaseModal from "./BaseModal";
import Loader from "../common/Loader";
import { UserFans } from "../../types/UserModel";

type CreateGroupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  users: UserFans[];
  loading: boolean;
  error: string;
  onCreate: (name: string, selectedUsers: number[]) => Promise<void>;
};

const CreateGroupModal = ({
  isOpen,
  onClose,
  users,
  loading,
  error,
  onCreate,
}: CreateGroupModalProps) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [groupName, setGroupName] = useState("");

  const handleSubmit = async () => {
    await onCreate(groupName, selectedUsers);
    setSelectedUsers([]);
    setGroupName("");
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="创建新群组"
      height="h-[600px]"
    >
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">群组名称</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">选择成员</label>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {users.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="mr-3"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user.id]);
                      } else {
                        setSelectedUsers(
                          selectedUsers.filter((id) => id !== user.id)
                        );
                      }
                    }}
                  />
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="ml-2">{user.username}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 border-t pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={loading || selectedUsers.length === 0}
          >
            {loading ? "创建中..." : "创建群组"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default CreateGroupModal;