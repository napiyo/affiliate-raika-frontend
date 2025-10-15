"use client";

import { Info } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface InfoTooltipProps {
  message: string;
  side?: "top" | "right" | "bottom" | "left";
}

export default function InfoTooltip({ message, side = "right" }: InfoTooltipProps) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 text-foreground hover:text-muted-foreground"
          >
            <Info className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side={side} className="text-xs font-medium">
          {message}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
