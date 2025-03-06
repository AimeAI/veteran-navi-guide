
import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  autocompleteResults?: string[];
  onSelectAutocomplete?: (value: string) => void;
  showAutocomplete?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, autocompleteResults, onSelectAutocomplete, showAutocomplete = false, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          aria-invalid={props['aria-invalid']}
          {...props}
        />
        
        {showAutocomplete && autocompleteResults && autocompleteResults.length > 0 && (
          <div className="absolute z-50 mt-1 w-full bg-background shadow-lg rounded-md border border-input max-h-60 overflow-auto">
            <ul className="py-1">
              {autocompleteResults.map((result, index) => (
                <li 
                  key={index} 
                  className="px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                  onClick={() => onSelectAutocomplete && onSelectAutocomplete(result)}
                >
                  {result}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
