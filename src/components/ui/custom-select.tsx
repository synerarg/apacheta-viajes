"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type SelectOption = {
  value: string
  label: string
}

type CustomSelectProps = {
  value: string
  onChange: (val: string) => void
  placeholder: string
  options: SelectOption[]
  /** "default" usa tokens foreground/border; "branded" usa dark-brown/off-white */
  variant?: "default" | "branded"
  className?: string
}

export function CustomSelect({
  value,
  onChange,
  placeholder,
  options,
  variant = "default",
  className,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selected = options.find((o) => o.value === value)
  const branded = variant === "branded"

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "w-full flex items-center justify-between bg-transparent border-0 border-b cursor-pointer",
          "px-0 font-sans text-base text-left focus:outline-none transition-colors duration-200",
          branded
            ? ["py-3", open ? "border-primary" : "border-dark-brown", selected ? "text-dark-brown" : "text-subtle"]
            : ["py-2", open ? "border-primary" : "border-border", selected ? "text-foreground" : "text-muted-foreground"],
        )}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 shrink-0 transition-transform duration-200",
            branded ? "text-subtle" : "text-muted-foreground",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown — posición absoluta, sin Portal, sin scroll lock */}
      <div
        className={cn(
          "absolute top-full left-0 w-full z-50 border shadow-lg overflow-hidden",
          "transition-all duration-200",
          branded ? "bg-off-white border-dark-brown/20" : "bg-background border-border",
          open
            ? "opacity-100 scale-y-100 pointer-events-auto"
            : "opacity-0 scale-y-95 pointer-events-none",
        )}
        style={{ transformOrigin: "top" }}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onChange(option.value)
              setOpen(false)
            }}
            className={cn(
              "w-full text-left px-3 py-3 font-sans text-sm transition-colors duration-150 cursor-pointer",
              branded
                ? value === option.value
                  ? "text-primary bg-primary/5 font-medium"
                  : "text-dark-brown hover:bg-primary/10"
                : value === option.value
                  ? "text-primary bg-primary/5 font-medium"
                  : "text-foreground hover:bg-accent",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
