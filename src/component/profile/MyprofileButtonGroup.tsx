import EditProfileButton from '../button/EditProfileButton';

interface MyProfileButtonGroupProps {
  handleEditClick: () => void;
}

const MyProfileButtonGroup: React.FC<MyProfileButtonGroupProps> = ({handleEditClick}) => {
  return (
    <div className="absolute left-1/2 top-52 ml-48 space-x-3 flex items-center">
      <EditProfileButton onClick={handleEditClick} />
    </div>
  );
}

export default MyProfileButtonGroup;

