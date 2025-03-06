
import React from "react";
import { parseTextForMentions, MentionedUser, TextSegment } from "@/utils/mentionUtils";
import MentionedUser from "./mentioned-user";

interface TextWithMentionsProps {
  text: string;
  users: MentionedUser[];
  className?: string;
}

const TextWithMentions: React.FC<TextWithMentionsProps> = ({ text, users, className }) => {
  const segments = parseTextForMentions(text, users);
  
  return (
    <div className={className}>
      {segments.map((segment, index) => {
        if (segment.type === 'mention' && segment.mentionData) {
          return <MentionedUser key={index} user={segment.mentionData} />;
        }
        return <span key={index}>{segment.content}</span>;
      })}
    </div>
  );
};

export default TextWithMentions;
