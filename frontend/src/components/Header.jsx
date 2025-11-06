import { Search, User } from "lucide-react";
import"../css/Header.css";
const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-[hsl(var(--header-bg))] backdrop-blur-lg border-b border-border z-50">
      <div className="flex items-center justify-between px-8 py-4">
        <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Music
        </h1>
        
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search for songs, artists, albums..."
              className="w-full pl-10 pr-4 py-2 bg-secondary text-foreground rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <button className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center hover:scale-110 transition-transform">
          <User className="w-5 h-5 text-white" />
        </button>
      </div>
    </header>
  );
};

export default Header;