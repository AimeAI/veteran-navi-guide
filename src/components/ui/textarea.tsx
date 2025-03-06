
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onMention?: (query: string) => void;
  showMentionSuggestions?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onMention, showMentionSuggestions = false, ...props }, ref) => {
    const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (onMention && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
        const textarea = e.currentTarget;
        const cursorPosition = textarea.selectionStart;
        const textBeforeCursor = textarea.value.substring(0, cursorPosition);
        
        // Check if we're potentially in a mention context
        const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
        
        if (mentionMatch) {
          const mentionQuery = mentionMatch[1];
          onMention(mentionQuery);
        } else if (showMentionSuggestions) {
          // If we're no longer in a mention context, call with empty string to hide suggestions
          onMention("");
        }
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Handle key navigation for mention suggestions
      if (showMentionSuggestions && 
          (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter' || e.key === 'Escape')) {
        // Let the parent component handle these keys for mention selection
        if (props.onKeyDown) {
          props.onKeyDown(e);
        }
      }
    };

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
