import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Menu } from 'lucide-react';

const NavigationHeader = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { path: '/', label: t('nav.home') },
    { path: '/calculadora', label: t('nav.calculator') },
    { path: '/painel', label: t('nav.dashboard') },
    { path: '/receitas', label: t('nav.recipes') },
    { path: '/planos', label: t('nav.plans') },
    { path: '/blog', label: t('nav.blog') },
    { path: '/perfil', label: t('nav.profile') }
  ];

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavLinks = ({ mobile = false }) => (
    <>
      {navigationItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => mobile && setIsOpen(false)}
          className={`${
            isActive(item.path) 
              ? 'text-primary font-medium' 
              : 'text-muted-foreground hover:text-foreground'
          } transition-colors duration-200 ${mobile ? 'block py-2 px-4' : ''}`}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <Calculator className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">
            Zero<span className="gradient-primary bg-clip-text text-transparent">Gram</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLinks />
        </nav>

        {/* Language Selector & Mobile Menu */}
        <div className="flex items-center space-x-4">
          <Select value={i18n.language} onValueChange={changeLanguage}>
            <SelectTrigger className="w-20 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">🇵🇹 PT</SelectItem>
              <SelectItem value="en">🇬🇧 EN</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-4 mt-8">
                <div className="flex items-center space-x-2 px-4 mb-4">
                  <div className="w-6 h-6 gradient-primary rounded-md flex items-center justify-center">
                    <Calculator className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold">ZeroGram</span>
                </div>
                <nav className="flex flex-col">
                  <NavLinks mobile={true} />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;