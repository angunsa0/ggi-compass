import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
const navItems = [{
  id: 'about',
  label: '기업소개'
}, {
  id: 'procurement',
  label: '나라장터/조달'
}, {
  id: 'products',
  label: '주요제품'
}, {
  id: 'contact',
  label: '견적/문의'
}];
export const Navbar = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'procurement', 'products', 'contact'];
      let current = 'hero';
      sections.forEach(section => {
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
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };
  return <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-black tracking-tighter text-primary">G.G.I</span>
          <div className="hidden sm:block text-[10px] text-muted-foreground leading-tight uppercase tracking-wider">
            GLOBAL GREAT<br />Infrastructure
          </div>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navItems.map(item => <button key={item.id} onClick={() => scrollToSection(item.id)} className={cn("text-foreground/70 hover:text-primary transition-colors", activeSection === item.id && "text-primary")}>
              {item.label}
            </button>)}
          <button onClick={() => scrollToSection('contact')} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-all font-bold shadow-md">
            견적/문의
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && <div className="md:hidden bg-white border-t border-border">
          <div className="px-6 py-4 space-y-4">
            {navItems.map(item => <button key={item.id} onClick={() => scrollToSection(item.id)} className="block w-full text-left text-foreground/70 hover:text-primary transition-colors py-2">
                {item.label}
              </button>)}
          </div>
        </div>}
    </nav>;
};