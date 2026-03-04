import { Menu, Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [searchValue, setSearchValue] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => mobileSearchRef.current?.focus(), 100);
    }
  }, [mobileSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/expenses?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
      setMobileSearchOpen(false);
      searchRef.current?.blur();
      mobileSearchRef.current?.blur();
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-surface-200 flex items-center justify-between px-6 gap-4 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form
          onSubmit={handleSearch}
          className={`hidden md:flex items-center gap-2 bg-surface-50 border rounded-lg px-3 py-1.5 transition-all duration-200 ${
            searchFocused ? 'w-80 border-primary-400 bg-white ring-2 ring-primary-100' : 'w-60 border-surface-200 hover:border-surface-300'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-surface-400 shrink-0" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search expenses…"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-transparent text-sm text-surface-800 placeholder:text-surface-400 outline-none w-full"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="hidden lg:inline text-[10px] text-surface-400 bg-white border border-surface-200 rounded px-1.5 py-0.5 font-mono shrink-0">
            ⌘K
          </kbd>
        </form>

        <button
          onClick={() => setMobileSearchOpen(true)}
          className="md:hidden p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition-colors cursor-pointer"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      <span className="hidden sm:inline text-xs text-surface-400 font-medium">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </span>

      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden animate-fade-in">
          <div className="flex items-center gap-3 h-14 px-4 border-b border-surface-200">
            <button
              onClick={() => {
                setMobileSearchOpen(false);
                setSearchValue('');
              }}
              className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 cursor-pointer"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
            <form onSubmit={handleSearch} className="flex-1">
              <input
                ref={mobileSearchRef}
                type="text"
                placeholder="Search expenses…"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full bg-transparent text-sm text-surface-800 placeholder:text-surface-400 outline-none py-2"
              />
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
