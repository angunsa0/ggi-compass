import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'hero', label: '핵심가치' },
  { id: 'stats', label: '강점지표' },
  { id: 'registry', label: '조달/인증' },
];

export const Navbar = () => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'stats', 'registry', 'contact'];
      let current = 'hero';
      
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 120) {
          current = section;
        }
      });
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-card/90 backdrop-blur-md z-50 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-black tracking-tighter text-primary">G.G.I</span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-bold tracking-tight">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "hover:text-accent transition-colors pb-1",
                activeSection === item.id && "text-accent border-b-2 border-accent"
              )}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => scrollToSection('contact')}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-sm hover:bg-accent transition-all"
          >
            문의하기
          </button>
        </div>
      </div>
    </nav>
  );
};
