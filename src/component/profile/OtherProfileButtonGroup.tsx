import { IconSearch, IconDots } from '@tabler/icons-react';
import FollowButton from '../button/FollowButton';


const OtherProfileButtonGroup = () => {
  return (
    <div className="absolute left-1/2 top-52 ml-28 space-x-3 flex items-center">
      {/* <StyledIconSearch /> */}
      <IconDots />
      <IconSearch />
      <FollowButton />
    </div>
  );
};

export default OtherProfileButtonGroup;