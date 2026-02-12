
import React from 'react';

interface CardProps {
  title: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer flex items-center justify-center min-h-[180px] p-10 rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/50 premium-shadow transition-all duration-700 ease-out hover:-translate-y-3 hover:premium-shadow-hover hover:bg-white/60"
    >
      <h3 className="text-center text-lg md:text-xl font-medium tracking-[0.15em] text-[#1e293b] uppercase leading-relaxed transition-all duration-500 group-hover:scale-[1.02] group-hover:text-[#1e3a8a]">
        {title}
      </h3>
    </div>
  );
};

export default Card;
