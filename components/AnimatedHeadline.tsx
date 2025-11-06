import React from 'react';

export const AnimatedHeadline = ({ text }: { text: string }) => {
  const words = text.split(' ');
  let delay = 0;

  return (
    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-3 whitespace-nowrap">
          {word.split('').map((char, charIndex) => {
            const currentDelay = delay;
            delay += 0.03;
            return (
              <span
                key={charIndex}
                className="inline-block animate-fade-up"
                style={{ animationDelay: `${currentDelay}s` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}
        </span>
      ))}
    </h2>
  );
};
