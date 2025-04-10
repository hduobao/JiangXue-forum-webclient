import { useNavigate } from "react-router-dom";
import { UserBaseInfo } from "../../types/UserModel";
import { getUserId } from "../../storage/storage";

interface UserExploreCardProps {
  user: UserBaseInfo;
  className?: string;
}

const UserExploreCard: React.FC<UserExploreCardProps> = ({ user, className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const currentUserId = getUserId();
    if(user.id.toString() == currentUserId) {
        navigate("/user-profile");
    } else {
        navigate(`/user-profile/${user.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center">
        <img
          src={user.avatar}
          alt="用户头像"
          className="w-12 h-12 rounded-full mr-4 object-cover"
        />
        <div>
          <h3 className="font-semibold">{user.username}</h3>
          <p className="text-gray-600 text-sm">@{user.account}</p>
        </div>
      </div>
      <div className="ml-16 text-black text-sm mt-1">{user.bio}</div>
    </div>
  );
};

export default UserExploreCard;
