import React from 'react';
import InputBase from './InputBase';

const UserInfoTextArea: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ id, label, value, onChange }) => {
  return (
    <InputBase>
      <div className="group">
        <textarea
          id={id}
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

export default UserInfoTextArea;
