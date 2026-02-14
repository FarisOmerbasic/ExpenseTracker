import { Menu, Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [searchValue, setSearchValue] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/expenses?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
      searchRef.current?.blur();
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-surface-200 flex items-center justify-between px-6 gap-4 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition-colors cursor-pointer"
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
      </div>

      <span className="hidden sm:inline text-xs text-surface-400 font-medium">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </span>
    </header>
  );
}
