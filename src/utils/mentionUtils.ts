
export interface MentionedUser {
  id: string;
  name: string;
  username: string;
}

export interface TextSegment {
  type: 'text' | 'mention';
  content: string;
  mentionData?: MentionedUser;
}

/**
 * Parse text and extract mentions
 * @param text The text to parse for mentions
 * @param users List of users that might be mentioned
 * @returns Array of text segments (regular text and mentions)
 */
export const parseTextForMentions = (text: string, users: MentionedUser[]): TextSegment[] => {
  if (!text) return [];
  
  // Match @username pattern
  const mentionRegex = /@(\w+)/g;
  const segments: TextSegment[] = [];
  
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    const matchedUsername = match[1];
    const startIndex = match.index;
    
    // Add text before the mention
    if (startIndex > lastIndex) {
      segments.push({
        type: 'text',
        content: text.substring(lastIndex, startIndex)
      });
    }
    
    // Find the mentioned user
    const mentionedUser = users.find(user => 
      user.username.toLowerCase() === matchedUsername.toLowerCase()
    );
    
    if (mentionedUser) {
      // Add the mention
      segments.push({
        type: 'mention',
        content: `@${matchedUsername}`,
        mentionData: mentionedUser
      });
    } else {
      // If user not found, treat as normal text
      segments.push({
        type: 'text',
        content: `@${matchedUsername}`
      });
    }
    
    lastIndex = startIndex + match[0].length;
  }
  
  // Add remaining text after the last mention
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.substring(lastIndex)
    });
  }
  
  return segments;
};

// Mock user data (this would come from Supabase in a real implementation)
export const mockUsers: MentionedUser[] = [
  { id: '1', name: 'John Doe', username: 'JohnDoe' },
  { id: '2', name: 'Sarah Miller', username: 'SarahMiller' },
  { id: '3', name: 'Mike Johnson', username: 'MikeJohnson' },
  { id: '4', name: 'Emily Williams', username: 'EmilyWilliams' },
  { id: '5', name: 'David Clark', username: 'DavidClark' },
  { id: '6', name: 'Amanda Wilson', username: 'AmandaWilson' },
  { id: '7', name: 'Veteran Support', username: 'VeteranSupport' },
  { id: '8', name: 'Tech Recruiter', username: 'TechRecruiter' },
  { id: '9', name: 'Resume Expert', username: 'ResumeExpert' },
];

/**
 * Filter users based on query string for mention suggestions
 */
export const filterUsersByQuery = (query: string, currentUserName?: string): MentionedUser[] => {
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  return mockUsers
    .filter(user => 
      // Don't suggest the current user
      (!currentUserName || user.username !== currentUserName) && 
      (user.username.toLowerCase().includes(lowerQuery) || 
       user.name.toLowerCase().includes(lowerQuery))
    )
    .slice(0, 5); // Limit to 5 suggestions
};

/**
 * Replace the current mention in the text with the selected user
 */
export const insertMention = (
  text: string, 
  cursorPosition: number,
  selectedUsername: string
): { newText: string; newCursorPosition: number } => {
  // Find the @ symbol before the cursor
  const textBeforeCursor = text.substring(0, cursorPosition);
  const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
  
  if (!mentionMatch) {
    return { newText: text, newCursorPosition: cursorPosition };
  }
  
  const mentionStartIndex = mentionMatch.index;
  const newText = 
    text.substring(0, mentionStartIndex) + 
    `@${selectedUsername} ` + 
    text.substring(cursorPosition);
  
  // Position cursor after the inserted mention
  const newCursorPosition = mentionStartIndex + selectedUsername.length + 2; // +2 for @ and space
  
  return { newText, newCursorPosition };
};
