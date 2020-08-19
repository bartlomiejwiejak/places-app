import React from 'react';

const Avatar = ({ image, alt, onClick, style, className }) => {
  return (
    <div onClick={onClick} style={style} className={`avatar ${className ? className : {}}`}>
      <img
        src={image}
        alt={alt}
      />
    </div>
  );
};

export default Avatar;
