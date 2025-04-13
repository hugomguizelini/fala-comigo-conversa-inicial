import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";
import { InsighorLogo } from "@/components/auth/InsighorLogo";
import { useBreakpoint } from "@/hooks/use-mobile";

const SalesFooter: React.FC = () => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";
  
  // Footer links organized by sections
  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Case Studies", href: "#" },
        { name: "Reviews", href: "#testimonials" },
        { name: "Updates", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Press", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "Help Center", href: "#" },
        { name: "API Reference", href: "#" },
        { name: "Community", href: "#" },
        { name: "Tutorials", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "GDPR", href: "#" },
        { name: "Security", href: "#" },
      ],
    },
  ];

  // Social media links
  const socialLinks = [
    { name: "Facebook", icon: <Facebook size={20} />, href: "#" },
    { name: "Twitter", icon: <Twitter size={20} />, href: "#" },
    { name: "Instagram", icon: <Instagram size={20} />, href: "#" },
    { name: "LinkedIn", icon: <Linkedin size={20} />, href: "#" },
    { name: "GitHub", icon: <Github size={20} />, href: "#" },
  ];

  return (
    <footer className="bg-[#0a0a14] border-t border-purple-900/20 pt-16 pb-8">
      <div className={`container mx-auto ${isMobile ? "px-4" : "px-8"}`}>
        {/* Main Footer Content */}
        <div className={`grid grid-cols-1 gap-8 ${isMobile ? "" : "md:grid-cols-2 lg:grid-cols-6"} mb-12`}>
          {/* Company Info */}
          <div className={`${isMobile ? "" : "lg:col-span-2"}`}>
            <InsighorLogo className="h-8 w-auto mb-4" />
            <p className="text-gray-400 mb-6 text-sm">
              AI-powered marketing intelligence platform that helps businesses optimize campaigns, understand customer behavior, and maximize ROI.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  aria-label={social.name}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Footer Navigation Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-purple-900/20 pt-8 mt-8">
          <div className={`flex ${isMobile ? "flex-col space-y-4" : "flex-row justify-between items-center"}`}>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Insighor.AI. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-2">
              <span className="flex items-center text-sm text-gray-500">
                Made with <span className="text-red-500 mx-1">♥</span> by Insighor Team
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SalesFooter;
