import React from 'react';
import InputBase from './InputBase';

const UserInfoInput: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ id, label, value, onChange }) => {
  return (
    <InputBase>
      <div className="group">
        <input
          id={id}
          type="text"
          value={value}
          onChange={onChange}
          required
          className="input"
        />
        <span className="highlight" />
        <span className="bar" />
        <label>{label}</label>
      </div>
    </InputBase>
  );
};

export default UserInfoInput;
