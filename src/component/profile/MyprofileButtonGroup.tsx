import styled from 'styled-components';
import EditProfileButton from '../button/EditProfileButton';

const MyProfileButtonGroup = () => {
  return (
    <div className="absolute left-1/2 top-52 ml-48 space-x-3 flex items-center">
      <EditProfileButton />
    </div>
  );
}

export default MyProfileButtonGroup;

