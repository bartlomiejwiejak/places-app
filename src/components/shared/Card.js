import React from 'react';

const Card = props => {
  return (
    <div onClick={props.onClick} className={`card ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default Card;
