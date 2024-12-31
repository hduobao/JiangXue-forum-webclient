import styled from 'styled-components';

const InputBase = styled.div`
  .group {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%; /* 确保占满容器宽度 */
  }

  .input, textarea {
    font-size: 16px;
    padding: 10px 10px 10px 5px;
    display: block;
    width: 100%;
    border: none;
    border-bottom: 1px solid #515151;
    background: transparent;
    resize: none; /* 禁用textarea的缩放 */
  }

  .input:focus, textarea:focus {
    outline: none;
  }

  label {
    color: #999;
    font-size: 18px;
    font-weight: normal;
    position: absolute;
    pointer-events: none;
    left: 5px;
    top: 10px;
    transition: 0.2s ease all;
  }

  .input:focus ~ label, .input:valid ~ label, textarea:focus ~ label, textarea:valid ~ label {
    top: -20px;
    font-size: 14px;
    color: #5264AE;
  }

  .bar {
    position: relative;
    display: block;
    width: 100%;
  }

  .bar:before,
  .bar:after {
    content: '';
    height: 2px;
    width: 0;
    bottom: 1px;
    position: absolute;
    background: #5264AE;
    transition: 0.2s ease all;
  }

  .bar:before {
    left: 50%;
  }

  .bar:after {
    right: 50%;
  }

  .input:focus ~ .bar:before, .input:focus ~ .bar:after, textarea:focus ~ .bar:before, textarea:focus ~ .bar:after {
    width: 50%;
  }

  .highlight {
    position: absolute;
    height: 60%;
    width: 100%;
    top: 25%;
    left: 0;
    pointer-events: none;
    opacity: 0.5;
  }

  .input:focus ~ .highlight, textarea:focus ~ .highlight {
    animation: inputHighlighter 0.3s ease;
  }

  @keyframes inputHighlighter {
    from {
      background: #5264AE;
    }
    to {
      width: 0;
      background: transparent;
    }
  }
`;

export default InputBase;
