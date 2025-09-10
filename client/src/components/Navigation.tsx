import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Sparkles } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" data-testid="logo-icon" />
            <span className="text-2xl font-bold text-foreground" data-testid="logo-text">
              Orion
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="gap-1 hover-elevate" 
                  data-testid="dropdown-features"
                >
                  Features <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem data-testid="menu-smart-reporting">Smart Reporting</DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-scenario-modeling">Scenario Modeling</DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-cost-intelligence">Cost Intelligence</DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-collaborative-planning">Collaborative Planning</DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-ai-assistant">AI Assistant</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" className="hover-elevate" data-testid="nav-solutions">
              Solutions
            </Button>
            <Button variant="ghost" className="hover-elevate" data-testid="nav-pricing">
              Pricing
            </Button>
            <Button variant="ghost" className="hover-elevate" data-testid="nav-resources">
              Resources
            </Button>
            <Button variant="ghost" className="hover-elevate" data-testid="nav-docs">
              Docs
            </Button>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:block hover-elevate" data-testid="button-sign-in">
              Sign In
            </Button>
            <Button className="hover-elevate active-elevate-2" data-testid="button-request-demo">
              Request Demo
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}