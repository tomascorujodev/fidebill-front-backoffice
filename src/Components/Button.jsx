import React from 'react';

export default function Button({ text = "boton", onClick, style = {}, className = "btn-success", disabled = false  }){
  return (
    <button
      onClick={onClick}
      className={`btn ${className}`}
      style={style}
      disabled={disabled}
    >
      {text}
    </button>
  );
}