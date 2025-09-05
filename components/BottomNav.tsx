import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import HomeIcon from './icons/HomeIcon';
import GearIcon from './icons/GearIcon';
import PlusIcon from './icons/PlusIcon';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  const [homeClickTimer, setHomeClickTimer] = useState<number | null>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (homeClickTimer) {
        clearTimeout(homeClickTimer);
      }
    };
  }, [homeClickTimer]);

  const handleHomeClick = () => {
    setIsAddMenuOpen(false);
    if (homeClickTimer) {
      clearTimeout(homeClickTimer);
      setHomeClickTimer(null);
      onNavigate('inicio');
    } else {
      const timer = window.setTimeout(() => {
        onNavigate('resumen');
        setHomeClickTimer(null);
      }, 300);
      setHomeClickTimer(timer);
    }
  };
  
  const handleSettingsClick = () => {
    setIsAddMenuOpen(false);
    onNavigate('ajustes');
  };

  const handleAddClick = () => {
    setIsAddMenuOpen(prev => !prev);
  };

  const handleNavigateAndClose = (page: Page) => {
    onNavigate(page);
    setIsAddMenuOpen(false);
  }
  
  const isHomeActive = ['resumen', 'inicio'].includes(currentPage);
  const isSettingsActive = currentPage === 'ajustes';

  return (
    <>
      {isAddMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 animate-fade-in"
          onClick={() => setIsAddMenuOpen(false)}
          aria-hidden="true"
        ></div>
      )}
      <footer className="fixed bottom-0 inset-x-0 z-30">
        {isAddMenuOpen && (
           <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 w-full px-8 max-w-sm mx-auto animate-fade-in">
            <button
              onClick={() => handleNavigateAndClose('ingresos')}
              className="w-full flex items-center justify-center gap-3 bg-[#008f39] text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-[#007a33] focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-offset-gray-900 transition-all duration-300 ease-out transform hover:-translate-y-1 active:scale-95"
            >
              <ArrowUpIcon className="w-6 h-6" />
              <span>Añadir Ingreso</span>
            </button>
            <button
              onClick={() => handleNavigateAndClose('gastos')}
              className="w-full flex items-center justify-center gap-3 bg-[#ef4444] text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-[#dc2626] focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-offset-gray-900 transition-all duration-300 ease-out transform hover:-translate-y-1 active:scale-95"
            >
              <ArrowDownIcon className="w-6 h-6" />
              <span>Añadir Gasto</span>
            </button>
          </div>
        )}
        <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl w-full shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] dark:shadow-none dark:border-t dark:border-white/10">
          <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
            <button
              onClick={handleHomeClick}
              aria-label="Ir a resumen o inicio"
              className={`flex items-center justify-center transition-colors duration-300 rounded-full w-14 h-14 focus:outline-none focus:ring-2 focus:ring-[#008f39] focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                isHomeActive
                  ? 'bg-[#008f39]/10 text-[#008f39] dark:bg-[#008f39]/20'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <HomeIcon className="w-7 h-7" />
            </button>
            <div className="w-14 h-14"></div>
            <button
              onClick={handleSettingsClick}
              aria-label="Ir a ajustes"
              className={`flex items-center justify-center transition-colors duration-300 rounded-full w-14 h-14 focus:outline-none focus:ring-2 focus:ring-[#008f39] focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                isSettingsActive
                  ? 'bg-[#008f39]/10 text-[#008f39] dark:bg-[#008f39]/20'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <GearIcon className="w-7 h-7" />
            </button>
          </div>
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/4">
            <button
              onClick={handleAddClick}
              aria-label={isAddMenuOpen ? "Cerrar menú de añadir" : "Añadir nueva transacción"}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-[#008f39]/50 ${
                isAddMenuOpen
                  ? 'bg-gray-500 dark:bg-gray-400 dark:text-gray-800 rotate-45'
                  : 'bg-[#008f39] hover:bg-[#007a33] hover:scale-105'
              }`}
            >
              <PlusIcon className="w-8 h-8" />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
};

export default BottomNav;