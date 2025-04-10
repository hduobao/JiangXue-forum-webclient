import BaseModal from "./BaseModal";
import Loader from "../common/Loader";
import { UserFans } from "../../types/UserModel";

type FanListModalProps = {
  isOpen: boolean;
  onClose: () => void;
  fans: UserFans[];
  loading: boolean;
  error: string;
  onSelect: (userId: number) => void;
};

const FanListModal = ({
  isOpen,
  onClose,
  fans,
  loading,
  error,
  onSelect,
}: FanListModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="选择粉丝发起私信"
    >
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loader />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center h-full flex items-center justify-center p-4">
          {error}
        </div>
      ) : fans.length === 0 ? (
        <div className="text-gray-500 text-center h-full flex items-center justify-center p-4">
          暂无粉丝
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {fans.map((fan) => (
            <div
              key={fan.id}
              onClick={() => onSelect(fan.id)}
              className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <img
                src={fan.avatar || "/default-avatar.png"}
                alt={fan.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-3 flex-1">
                <div className="font-medium">{fan.username}</div>
                <div className="text-sm text-gray-500 line-clamp-1">
                  {fan.bio || "暂无简介"}
                </div>
              </div>
              {fan.mutual_follow && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  互相关注
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </BaseModal>
  );
};

export default FanListModal;