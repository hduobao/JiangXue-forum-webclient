import { IconSearch, IconMail } from "@tabler/icons-react";
import FollowButton from "../button/FollowButton";

interface OtherProfileButtonGroupProps {
  followStatus : boolean;
  handleMailClick: () => void;
  handleSearchClick: () => void; // 从外部传入的函数
  handleFollowClick: () => Promise<void>; // 从外部传入的函数
}

const OtherProfileButtonGroup: React.FC<OtherProfileButtonGroupProps> = ({ followStatus, handleMailClick, handleSearchClick, handleFollowClick }) => {
  return (
    <div className="absolute left-1/2 top-52 ml-28 space-x-3 flex items-center">
      {/* <StyledIconSearch /> */}
      <IconMail onClick={handleMailClick} className="cursor-pointer" />
      <IconSearch onClick={handleSearchClick} className="cursor-pointer" />
      <FollowButton onClick={handleFollowClick} followStatus={followStatus} />
    </div>
  );
};

export default OtherProfileButtonGroup;
