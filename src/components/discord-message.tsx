import { cn } from "@/utils"
import { Clock } from "lucide-react"
import Image from "next/image"

interface DiscordMessageProps {
  avatarSrc: string
  avatarAlt: string
  username: string
  timestamp: string
  badgeText?: string
  badgeColor?: string
  title: string
  content: {
    [key: string]: string
  }
}

type BadgeColor = "#43b581" | "#faa61a" | (string & {})

const getBadgeStyles = (color: BadgeColor) => {
  switch (color) {
    case "#43b581":
      return "bg-green-500/10 text-green-400 ring-green-500/20"
    case "#faa61a":
      return "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20"
    default:
      return "bg-gray-500/10 text-gray-400 ring-gray-500/20"
  }
}

export const DiscordMessage = ({
  avatarAlt,
  avatarSrc,
  content,
  timestamp,
  title,
  username,
  badgeColor = "#43b581",
  badgeText,
}: DiscordMessageProps) => {
  return (
    <div className="relative flex flex-col rounded-lg bg-slate-900 p-4">
      {/* Left accent border */}
      <div className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-indigo-500" />
      
      {/* Header section */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-slate-800 p-2">
            <Clock className="h-4 w-4 text-slate-400" />
          </div>
          <span className="font-medium text-white">{title}</span>
          {badgeText && (
            <span className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
              getBadgeStyles(badgeColor)
            )}>
              {badgeText}
            </span>
          )}
        </div>
      </div>

      {/* Content section */}
      <div className="mb-2 text-sm text-slate-300">
        {Object.entries(content).map(([key, value], index) => (
          <div key={key} className="mb-1 flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-400">{key}:</span>
              <span>{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Timestamp */}
      <div className="text-xs text-slate-500">
        {timestamp}
      </div>
    </div>
  );
}