"use client";

import { Button } from "@/components/ui/button";
import { StarIcon, StarOffIcon } from "lucide-react";
import { useState, useEffect, forwardRef } from "react";
import { toast } from "sonner"; // ✅ assuming you’re using sonner or similar
import { toggleStarMarked } from "../actions";
interface MarkedToggleButtonProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  markedForRevision: boolean;
  id: string;

}

const MarkedToggleButton = forwardRef<HTMLButtonElement, MarkedToggleButtonProps>(
  ({ markedForRevision, id, onClick, ...props }, ref) => {
    const [isMarked, setIsMarked] = useState(markedForRevision);

    useEffect(() => {
      setIsMarked(markedForRevision);
    }, [markedForRevision]);

    const handleToggle = async (event: React.MouseEvent<HTMLButtonElement>) => {
      // Call original onClick if parent passed it
      onClick?.(event);

      const newMarkedState = !isMarked;
      setIsMarked(newMarkedState);

      try {
        const res = await toggleStarMarked(id, newMarkedState);
        const { success, error, isMarked: serverMarked } = res;

        if (serverMarked && !error && success) {
          toast.success("Added to Favorites successfully");
        } else if (!serverMarked && !error && success) {
          toast.success("Removed from Favorites successfully");
        } else {
          toast.error("Something went wrong, please try again");
          setIsMarked(!newMarkedState); // rollback
        }
      } catch (error) {
        console.error("Failed to toggle mark for revision:", error);
        setIsMarked(!newMarkedState); // rollback
        toast.error("Failed to update. Please try again later.");
      }
    };

    return (
      <Button
        ref={ref}
        variant={isMarked ?"default": "outline" }
        className="w-45"
        size="icon"
        onClick={handleToggle}
        {...props}
      >
        {isMarked ? (
          <div className="flex w-45 gap-4 pl-2">
            <StarIcon className="w-5 h-5 text-yellow-500" />
            <p>Unmark</p>
          </div>

        ) : (
          <div className="flex w-45 gap-4 pl-2">
          <StarOffIcon className="w-5 h-5" />
          
          <p>Mark</p>
          </div>
        )}
      </Button>
    );
  }
);

MarkedToggleButton.displayName = "MarkedToggleButton";

export default MarkedToggleButton;
