interface BilingualTextProps {
  text: string;
}

export function BilingualText({ text }: BilingualTextProps) {
  // Parse text like "होम (Home)" or "मेन्यू (Menu)"
  const match = text.match(/^(.+?)\s*\(([^)]+)\)$/);
  
  if (!match) {
    // No parentheses found, return text as-is
    return <>{text}</>;
  }
  
  const [, primaryText, secondaryText] = match;
  
  return (
    <>
      {primaryText}
      {' '}
      <span style={{ 
        fontSize: '0.7em', 
        opacity: 0.5,
        fontWeight: '400',
        letterSpacing: '0'
      }}>
        ({secondaryText})
      </span>
    </>
  );
}
