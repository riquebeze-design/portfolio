import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { LogIn } from 'lucide-react';

interface PublicNavbarProps {
  logoInitials: React.ReactNode;
  logoName: React.ReactNode;
  navLinks: { label: string; to: string; }[];
  resumeLabel: string;
  onResumeClick?: () => void;
}

const PublicNavbar: React.FC<PublicNavbarProps> = ({
  logoInitials,
  logoName,
  navLinks,
  resumeLabel,
  onResumeClick,
}) => {
  const navigate = useNavigate();

  return (
    <nav className="w-full px-6 py-4 bg-background/80 backdrop-blur-md shadow-sm sticky top-0 z-50 rounded-b-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-border backdrop-blur-md border border-border flex items-center justify-center">
            <span className="text-sm font-bold text-foreground">{logoInitials}</span>
          </div>
          <Link to="/" className="text-lg font-medium text-foreground hover:text-purple-700 transition-colors">
            {logoName}
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <Button key={link.label} asChild variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors text-sm rounded-full px-4 py-2">
              <Link to={link.to}>{link.label}</Link>
            </Button>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          {onResumeClick && (
            <Button onClick={onResumeClick} className="glass-button px-4 py-2 rounded-full text-foreground text-sm font-medium">
              {resumeLabel}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;