
import React from "react";
import { User } from "lucide-react";
import { MentionedUser } from "@/utils/mentionUtils";

interface MentionSuggestionsProps {
  suggestions: MentionedUser[];
  isVisible: boolean;
  onSelectUser: (user: MentionedUser) => void;
  activeIndex: number;
}

const MentionSuggestions: React.FC<MentionSuggestionsProps> = ({
  suggestions,
  isVisible,
  onSelectUser,
  activeIndex
}) => {
  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute z-50 mt-1 bg-popover shadow-md rounded-md border border-border overflow-hidden">
      <div className="py-1 max-h-[200px] overflow-y-auto">
        {suggestions.map((user, index) => (
          <button
            key={user.id}
            className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-muted ${
              index === activeIndex ? "bg-muted" : ""
            }`}
            onClick={() => onSelectUser(user)}
          >
            <span className="flex-shrink-0 bg-primary/10 rounded-full p-1">
              <User className="h-4 w-4 text-primary" />
            </span>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{user.name}</span>
              <span className="text-xs text-muted-foreground">@{user.username}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MentionSuggestions;
