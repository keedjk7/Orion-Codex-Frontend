import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { SiLinkedin, SiX, SiGithub } from "react-icons/si";

const footerSections = [
  {
    title: "Product",
    links: [
      "Features",
      "Pricing", 
      "Enterprise",
      "Security",
      "Integrations"
    ]
  },
  {
    title: "Resources", 
    links: [
      "Documentation",
      "API Reference",
      "Blog",
      "Case Studies",
      "Webinars"
    ]
  },
  {
    title: "Support",
    links: [
      "Help Center",
      "Contact Sales", 
      "System Status",
      "Community",
      "Training"
    ]
  },
  {
    title: "Company",
    links: [
      "About Us",
      "Careers", 
      "News",
      "Partners",
      "Investors"
    ]
  },
  {
    title: "Legal",
    links: [
      "Privacy Policy",
      "Terms of Service",
      "Data Processing",
      "Cookie Policy",
      "Compliance"
    ]
  }
];

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-6 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-primary" data-testid="footer-logo-icon" />
              <span className="text-2xl font-bold text-foreground" data-testid="footer-logo-text">
                Orion
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Your AI-powered finance team companion. Transform FP&A with intelligent automation.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="hover-elevate" data-testid="social-linkedin">
                <SiLinkedin className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover-elevate" data-testid="social-twitter">
                <SiX className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover-elevate" data-testid="social-github">
                <SiGithub className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="md:col-span-1">
              <h3 className="font-semibold text-foreground mb-4" data-testid={`footer-section-${index}`}>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Button 
                      variant="ghost" 
                      className="h-auto p-0 text-muted-foreground hover:text-foreground text-sm justify-start hover-elevate"
                      data-testid={`footer-link-${index}-${linkIndex}`}
                    >
                      {link}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm" data-testid="footer-copyright">
              © 2024 Orion Technologies, Inc. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Button variant="ghost" className="h-auto p-0 text-muted-foreground hover:text-foreground hover-elevate" data-testid="footer-privacy">
                Privacy
              </Button>
              <Button variant="ghost" className="h-auto p-0 text-muted-foreground hover:text-foreground hover-elevate" data-testid="footer-terms">
                Terms
              </Button>
              <Button variant="ghost" className="h-auto p-0 text-muted-foreground hover:text-foreground hover-elevate" data-testid="footer-cookies">
                Cookies
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}