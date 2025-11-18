import React from 'react';
import { useMousePosition } from '../../../hooks/useMousePosition';
import './LightEffect.css';

const LightEffect = () => {
  const { x, y } = useMousePosition();

  return (
    <div 
      className="light-effect"
      style={{
        left: `${x}px`,
        top: `${y}px`
      }}
    />
  );
};

export default LightEffect;