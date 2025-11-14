"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Search } from "lucide-react"

interface ScrollToSectionButtonProps {
  targetId: string
  buttonText: string
  messageText: string
}

export function ScrollToSectionButton({ targetId, buttonText, messageText }: ScrollToSectionButtonProps) {
  const scrollToSection = () => {
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth' 
      })
    }
  }

  return (
    <div className="text-center">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-white" />
          <span className="text-white font-medium">
            {messageText}
          </span>
        </div>
        <Button 
          variant="outline" 
          className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm shadow-lg px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
          onClick={scrollToSection}
        >
          <span className="flex items-center gap-2 cursor-pointer">
            {buttonText}
            <ArrowRight className="w-4 h-4" />
          </span>
        </Button>
      </div>
    </div>
  )
}
