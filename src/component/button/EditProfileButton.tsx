import styled from 'styled-components';

interface EditProfileButtonProps {
  onClick: () => void; // 父组件传入的点击事件
}

const EditProfileButton: React.FC<EditProfileButtonProps> = ({onClick}) => {
  return (
    <StyledWrapper>
      <div className="container-button">
        <div className="hover bt-1" />
        <div className="hover bt-2" />
        <div className="hover bt-3" />
        <div className="hover bt-4" />
        <div className="hover bt-5" />
        <div className="hover bt-6" />
        <button onClick={onClick} />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container-button {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas: "bt-1 bt-2 bt-3"
      "bt-4 bt-5 bt-6";
    position: relative;
    perspective: 800;
    padding: 0;
    width: 80px;
    height: 40px;
    border-radius: 20px; /* Increased the border-radius for more rounded corners */
    transition: all 0.3s ease-in-out;
  }

  .container-button:active {
    transform: scale(0.95);
  }

  .hover {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 200;
  }

  .bt-1 {
    grid-area: bt-1;
  }

  .bt-2 {
    grid-area: bt-2;
  }

  .bt-3 {
    grid-area: bt-3;
  }

  .bt-4 {
    grid-area: bt-4;
  }

  .bt-5 {
    grid-area: bt-5;
  }

  .bt-6 {
    grid-area: bt-6;
  }

  .bt-1:hover ~ button {
    transform: rotateX(15deg) rotateY(-15deg) rotateZ(0deg);
    box-shadow: -2px -2px #18181888;
  }

  .bt-1:hover ~ button::after {
    animation: shake 0.5s ease-in-out 0.3s;
    text-shadow: -2px -2px #18181888;
  }

  .bt-3:hover ~ button {
    transform: rotateX(15deg) rotateY(15deg) rotateZ(0deg);
    box-shadow: 2px -2px #18181888;
  }

  .bt-3:hover ~ button::after {
    animation: shake 0.5s ease-in-out 0.3s;
    text-shadow: 2px -2px #18181888;
  }

  .bt-4:hover ~ button {
    transform: rotateX(-15deg) rotateY(-15deg) rotateZ(0deg);
    box-shadow: -2px 2px #18181888;
  }

  .bt-4:hover ~ button::after {
    animation: shake 0.5s ease-in-out 0.3s;
    text-shadow: -2px 2px #18181888;
  }

  .bt-6:hover ~ button {
    transform: rotateX(-15deg) rotateY(15deg) rotateZ(0deg);
    box-shadow: 2px 2px #18181888;
  }

  .bt-6:hover ~ button::after {
    animation: shake 0.5s ease-in-out 0.3s;
    text-shadow: 2px 2px #18181888;
  }

  .hover:hover ~ button::before {
    background: transparent;
  }

  .hover:hover ~ button::after {
    content: "Click";
    top: -150%;
    transform: translate(-50%, 0);
    font-size: 34px;
    color: rgb(59 130 246 / var(--tw-bg-opacity));
  }

  button {
    position: absolute;
    padding: 0;
    width: 80px;
    height: 40px;
    background-color: #3b82f6; /* Blue background */
    color: #ffffff;
    font-size: 17px;
    font-weight: 900;
    border: 3px solid #ffffff; /* White border */
    border-radius: 20px; /* Increased the border-radius for more rounded corners */
    transition: all 0.3s ease-in-out;
  }

  button:hover {
    background-color: #ffffff; /* White background on hover */
    color: #3b82f6; /* Blue text color on hover */
    border: 3px solid #3b82f6; /* Blue border on hover */
  }

  button::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 40px;
    background-color: #3b82f6;
    border-radius: 20px; /* Increased the border-radius for more rounded corners */
    transition: all 0.3s ease-in-out;
    z-index: -1;
  }

  button::after {
    content: "编辑";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 40px;
    background-color: transparent;
    font-size: 17px;
    font-weight: 900;
    line-height: 40px;  /* Ensure vertical centering */
    color: #ffffff;
    border: none;
    border-radius: 20px; /* Increased the border-radius for more rounded corners */
    transition: all 0.3s ease-in-out;
    z-index: 2;
  }

  @keyframes shake {
    0% {
      left: 45%;
    }

    25% {
      left: 54%;
    }

    50% {
      left: 48%;
    }

    75% {
      left: 52%;
    }

    100% {
      left: 50%;
    }
  }
`;

export default EditProfileButton;
