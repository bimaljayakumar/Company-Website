import React from 'react';

interface MatrixTitleProps {
  title?: string;
  className?: string;
}

export const MatrixTitle: React.FC<MatrixTitleProps> = ({
  title = "WHAT'S NEXT?",
  className = "font-jakarta text-3xl sm:text-5xl lg:text-6xl font-black text-paper tracking-tight leading-tight",
}) => {
  // Match "Next" or "NEXT" or "next"
  const nextRegex = /(next)/i;
  const match = title.match(nextRegex);

  if (!match) {
    return <h2 className={className}>{title}</h2>;
  }

  const nextWordIndex = match.index ?? -1;
  const matchedWord = match[0]; // e.g. "NEXT" or "Next"
  const beforeText = title.slice(0, nextWordIndex);
  const afterText = title.slice(nextWordIndex + matchedWord.length);

  return (
    <h2 className={className}>
      {beforeText && <span className="mr-2.5 sm:mr-3.5">{beforeText}</span>}
      
      {/* Matrix animated "NEXT" word with LED-style dot-by-dot cascading shimmer */}
      <span className="led-word-container ml-1.5 mr-1.5">
        {matchedWord.split('').map((char, index) => (
          <span
            key={index}
            className={`led-dot led-dot-${index + 1}`}
            style={{ animationDelay: `${index * 0.18}s` }}
          >
            {char}
          </span>
        ))}
      </span>

      {afterText && <span>{afterText}</span>}
    </h2>
  );
};
