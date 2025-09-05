import React, { useState } from 'react';
import { FixedExpense, Category } from '../types';
import CloseIcon from './icons/CloseIcon';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import BoltIcon from './icons/BoltIcon';

interface FixedExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  fixedExpenses: FixedExpense[];
  categories: Category[];
  onAddFixedExpense: (name: string, amount: number, categoryId?: string) => void;
  onDeleteFixedExpense: (id: string) => void;
  onSelectFixedExpense: (expense: FixedExpense) => void;
  currency: string;
}

const FixedExpenseModal: React.FC<FixedExpenseModalProps> = ({ 
    isOpen, onClose, fixedExpenses, categories, onAddFixedExpense, onDeleteFixedExpense, onSelectFixedExpense, currency
}) => {
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', categoryId: '' });

  const formatCurrency = (amount: number) => {
    const locale = currency === 'COP' ? 'es-CO' : (currency === 'CLP' ? 'es-CL' : 'es-ES');
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    }).format(amount);
  };
  
  if (!isOpen) return null;

  const handleAdd = () => {
    const sanitizedAmount = newExpense.amount.replace(',', '.');
    const numericAmount = parseFloat(sanitizedAmount);
    if (newExpense.name.trim() && !isNaN(numericAmount) && numericAmount > 0) {
      onAddFixedExpense(newExpense.name.trim(), numericAmount, newExpense.categoryId || undefined);
      setNewExpense({ name: '', amount: '', categoryId: '' });
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent selection when deleting
    if (window.confirm('¿Estás seguro de que quieres eliminar este gasto fijo?')) {
      onDeleteFixedExpense(id);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="fixed-expense-modal-title"
    >
      <div 
        className="bg-white dark:bg-gray-900 dark:border dark:border-gray-800 rounded-2xl shadow-2xl w-full max-w-md m-4 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="fixed-expense-modal-title" className="text-xl font-bold">Gastos Fijos</h2>
          <button onClick={onClose} aria-label="Cerrar modal" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-4 space-y-2 overflow-y-auto">
          {fixedExpenses.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">No hay gastos fijos guardados.</p>
          ) : (
            fixedExpenses.map(exp => {
              const category = categories.find(c => c.id === exp.categoryId);
              return (
                <div key={exp.id} className="group flex items-center justify-between rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                  <button 
                    onClick={() => onSelectFixedExpense(exp)}
                    className="flex-grow w-full flex items-center justify-between p-3 rounded-lg text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <BoltIcon className="w-5 h-5 text-amber-500" />
                      <div>
                        <span className="font-semibold">{exp.name}</span>
                        {category && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{category.name}</p>}
                      </div>
                    </div>
                    <span className="font-mono">{formatCurrency(exp.amount)}</span>
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, exp.id)} 
                    className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all ml-2"
                    aria-label={`Eliminar ${exp.name}`}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <footer className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newExpense.name}
                onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
                placeholder="Nombre (ej. Alquiler)"
                className="sm:col-span-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#008f39] focus:border-[#008f39] bg-gray-50 dark:bg-gray-700"
              />
              <input
                type="text"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                placeholder="Monto"
                pattern="[0-9]+([,\.][0-9]{1,2})?"
                inputMode="decimal"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#008f39] focus:border-[#008f39] bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <div>
              <select
                value={newExpense.categoryId}
                onChange={(e) => setNewExpense({...newExpense, categoryId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#008f39] focus:border-[#008f39] bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Seleccionar categoría (opcional)</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAdd}
              aria-label="Añadir nuevo gasto fijo"
              className="w-full flex items-center justify-center gap-2 bg-[#008f39] text-white font-bold py-2 px-4 rounded-md hover:bg-[#007a33] focus:outline-none focus:ring-2 focus:ring-[#008f39] focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
            >
              <PlusIcon className="w-5 h-5" /> Añadir Gasto Fijo
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default FixedExpenseModal;