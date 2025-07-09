import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Menu, User, LogOut, Settings, ExternalLink } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useStoreConfig } from '@/hooks/useStoreConfig';

const NavigationHeader = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, isPremium, signOut, loading } = useAuth();
  const { storeConfig, loading: storeLoading } = useStoreConfig();

  const navigationItems = [
    { path: '/', label: t('nav.home') },
    { path: '/calculadora', label: t('nav.calculator') },
    { path: '/painel', label: t('nav.dashboard') },
    { path: '/receitas', label: t('nav.recipes') },
    { path: '/planos', label: t('nav.plans') },
    { path: '/vip', label: 'VIP' },
    { path: '/blog', label: t('nav.blog') },
    ...(isAdmin ? [{ path: '/admin', label: 'Admin' }] : []),
    ...(isPremium ? [{ path: '/criar', label: 'Criar Conteúdo' }] : []),
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
          
          {/* Store Button */}
          {!storeLoading && storeConfig.url && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(storeConfig.url, '_blank')}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              {i18n.language === 'pt' ? storeConfig.namePt : storeConfig.nameEn}
            </Button>
          )}
        </nav>

        {/* Language Selector & Auth */}
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

          {/* Auth Section */}
          {loading ? (
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  {user.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/perfil" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                {isPremium && (
                  <DropdownMenuItem asChild>
                    <Link to="/criar" className="flex items-center">
                      <Crown className="mr-2 h-4 w-4" />
                      Criar Conteúdo
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={signOut}
                  className="flex items-center text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default">
              <Link to="/auth">Entrar</Link>
            </Button>
          )}

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
                  
                  {/* Mobile Store Button */}
                  {!storeLoading && storeConfig.url && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        window.open(storeConfig.url, '_blank');
                        setIsOpen(false);
                      }}
                      className="gap-2 mt-4 mx-4"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {i18n.language === 'pt' ? storeConfig.namePt : storeConfig.nameEn}
                    </Button>
                  )}
                </nav>
                
                {/* Mobile Auth */}
                <div className="px-4 pt-4 border-t">
                  {user ? (
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                      <Button 
                        onClick={signOut} 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </Button>
                    </div>
                  ) : (
                    <Button asChild className="w-full">
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        Entrar
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;