import { useState } from 'react';
import styled from 'styled-components';
import { IconSnowflake } from '@tabler/icons-react';

const FollowButton = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <StyledWrapper>
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <p>关注</p>
        {hovered ? (
          <IconSnowflake
            size={16}
            color="#fff" // 设置悬浮时的图标颜色
          />
        ) : (
          <IconSnowflake
            size={16}
            color="#0077b5" // 设置默认状态下的图标颜色
          />
        )}
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    background-color: #fff;
    border: 1px solid #0077b5;
    padding: 5px;
    position: relative;
    width: 4.7em;
    height: 2em;
    transition: 0.5s;
    font-size: 17px;
    border-radius: 2em;
  }

  button p {
    position: absolute;
    top: 50%;
    left: 1.2em;
    transform: translateY(-50%);
    margin: 0;
    padding: 0;
    transition: 0.5s;
    color: #0077b5;
    font-weight: bold; /* 让文本加粗 */
  }

  button svg, button img {
    position: absolute;
    top: 0.45em;
    right: 0.5em;
    margin: 0;
    padding: 0;
    opacity: 0;
    transition: 0.5s;
    height: 1em;
  }

  button:hover p {
    left: 0.6em;
    color: #fff;
  }

  button:hover svg,
  button:hover img {
    opacity: 1;
  }

  button:hover {
    background-color: #0077b5;
  }
`;

export default FollowButton;
