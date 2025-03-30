
import { Link } from "react-router-dom";
import { Search, Menu, User, Trophy, Calendar, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm dark:bg-gray-900">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-soccer-grass" />
            <span className="text-xl font-bold">Futebol<span className="text-soccer-score">Análise</span></span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/partidas" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            Partidas
          </Link>
          <Link to="/mais-votados" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            Mais Votados
          </Link>
          <Link to="/ao-vivo" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            Ao Vivo
          </Link>
          <Link to="/comunidade" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            Comunidade
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar partidas..."
              className="w-[200px] pl-8 rounded-full"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="relative">
            <BellRing className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-slide-in border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/partidas" className="block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              Partidas
            </Link>
            <Link to="/mais-votados" className="block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              Mais Votados
            </Link>
            <Link to="/ao-vivo" className="block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              Ao Vivo
            </Link>
            <Link to="/comunidade" className="block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              Comunidade
            </Link>
            <div className="relative mt-3 flex items-center">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar partidas..."
                className="w-full pl-8 rounded-full"
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
