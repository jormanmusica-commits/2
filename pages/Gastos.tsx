import React, { useState, useRef } from 'react';
// FIX: Import Category and FixedExpense types
import { Page, Profile, Category, FixedExpense } from '../types';
import TransactionForm from '../components/TransactionForm';
import Summary from '../components/Summary';
import CategoryModal from '../components/CategoryModal';
import BankAccountModal from '../components/BankAccountModal';
import BankSelectionModal from '../components/BankSelectionModal';
import BankIcon from '../components/icons/BankIcon';
import FixedExpenseModal from '../components/FixedExpenseModal';

const CASH_METHOD_ID = 'efectivo';

interface GastosProps {
  profile: Profile;
  balance: number;
  balancesByMethod: Record<string, number>;
  onAddTransaction: (description: string, amount: number, date: string, type: 'income' | 'expense', paymentMethodId: string, categoryId?: string) => void;
  onNavigate: (page: Page) => void;
  onAddCategory: (name: string) => void;
  onUpdateCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
  onAddBankAccount: (name: string, color: string) => void;
  onUpdateBankAccount: (id: string, name: string, color: string) => void;
  onDeleteBankAccount: (id: string) => void;
  onAddFixedExpense: (name: string, amount: number, categoryId?: string) => void;
  onDeleteFixedExpense: (id: string) => void;
  minDateForExpenses?: string;
  onInitiateDeposit: () => void;
  onInitiateWithdrawal: () => void;
}

const Gastos: React.FC<GastosProps> = ({ 
    profile, balance, balancesByMethod, onAddTransaction,
    onAddCategory, onUpdateCategory, onDeleteCategory,
    onAddBankAccount, onUpdateBankAccount, onDeleteBankAccount,
    onAddFixedExpense, onDeleteFixedExpense,
    minDateForExpenses,
    onInitiateDeposit, onInitiateWithdrawal
}) => {
    // FIX: Destructure categories, bankAccounts, and fixedExpenses from profile.data
    const { data: { categories, bankAccounts, fixedExpenses }, currency } = profile;
    const [activeMethodId, setActiveMethodId] = useState<string | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [isBankSelectionModalOpen, setIsBankSelectionModalOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
    const [isFixedExpenseModalOpen, setIsFixedExpenseModalOpen] = useState(false);
    const formContainerRef = useRef<HTMLDivElement>(null);

    const bankBalance = Object.entries(balancesByMethod)
      .filter(([id]) => id !== CASH_METHOD_ID)
      .reduce((sum, [, amount]) => sum + amount, 0);
    const cashBalance = balancesByMethod[CASH_METHOD_ID] || 0;

    const isBankDisabled = bankBalance <= 0;
    const isCashDisabled = cashBalance <= 0;
    
    const handleSelectMethod = (id: string) => {
      setActiveMethodId(id);
      setIsFormVisible(true);
    };

    const getButtonClass = (isActive: boolean, disabled = false) => {
        const baseClasses = 'w-full flex items-center justify-center gap-2 p-3 font-semibold text-center rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900';
        
        if (disabled) {
          return `${baseClasses} bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60`;
        }
  
        if (isActive) {
            return `${baseClasses} text-white shadow-md`;
        }
        return `${baseClasses} bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300`;
    };

    const selectedBank = bankAccounts.find(b => b.id === activeMethodId);

    const handleBankSelect = (bankId: string) => {
      handleSelectMethod(bankId);
      setIsBankSelectionModalOpen(false);
    };

    const handleFormSubmit = (description: string, amount: number, date: string, categoryId?: string) => {
        if (activeMethodId) {
          onAddTransaction(description, amount, date, 'expense', activeMethodId, categoryId);
          setIsFormVisible(false);
        }
    };
    
    const handleAnimationEnd = () => {
      if (!isFormVisible) {
        setActiveMethodId(null);
        setSelectedCategoryId(undefined);
      }
    };

    const handleSelectCategory = (category: Category) => {
        setSelectedCategoryId(category.id);
        setIsCategoryModalOpen(false);
    };

    const handleSelectFixedExpense = (expense: FixedExpense) => {
      if (!activeMethodId) {
        alert('Por favor, selecciona primero un método de pago.');
        return;
      }
      onAddTransaction(
        expense.name,
        expense.amount,
        new Date().toISOString().split('T')[0],
        'expense',
        activeMethodId,
        expense.categoryId
      );
      setIsFixedExpenseModalOpen(false);
      setIsFormVisible(false);
    };

    return (
      <>
        <div className="relative animate-fade-in">
          {/* The Glow Effect */}
          <div className="absolute -inset-2 bg-gradient-to-br from-[#ef4444] to-red-400 rounded-2xl blur-xl animate-glow opacity-50"></div>
          
          {/* The Content Card */}
          <div className="relative p-4 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md ring-1 ring-black/5 dark:ring-white/10">
              <div className="flex justify-center items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#ef4444] dark:text-[#ef4444]">
                      Añadir Gastos
                  </h2>
              </div>

              <div className="mb-8">
                  <Summary 
                      balance={balance} 
                      balancesByMethod={balancesByMethod}
                      onCashClick={onInitiateDeposit}
                      onBankClick={onInitiateWithdrawal}
                      currency={currency}
                  />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">1. Selecciona un método:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setIsBankSelectionModalOpen(true)}
                      className={getButtonClass(!!selectedBank, isBankDisabled)}
                      style={selectedBank ? { backgroundColor: selectedBank.color, color: 'white', borderColor: 'transparent', '--tw-ring-color': selectedBank.color } as React.CSSProperties : {}}
                      disabled={isBankDisabled}
                    >
                      <BankIcon className="w-5 h-5" />
                      {selectedBank ? selectedBank.name : 'Banco / Tarjeta'}
                    </button>
                    <button
                      onClick={() => handleSelectMethod(CASH_METHOD_ID)}
                      className={getButtonClass(activeMethodId === CASH_METHOD_ID, isCashDisabled)}
                      style={activeMethodId === CASH_METHOD_ID ? { backgroundColor: '#008f39', '--tw-ring-color': '#008f39' } as React.CSSProperties : {}}
                      disabled={isCashDisabled}
                    >
                      Efectivo
                    </button>
                  </div>
                </div>
                
                <div 
                  className={`transition-all duration-700 ease-in-out overflow-hidden ${isFormVisible ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                  ref={formContainerRef}
                  onTransitionEnd={handleAnimationEnd}
                >
                  {activeMethodId && (
                      <TransactionForm 
                          key={activeMethodId}
                          transactionType="expense" 
                          onAddTransaction={handleFormSubmit}
                          categories={categories}
                          selectedCategoryId={selectedCategoryId}
                          onCategorySelectClick={() => setIsCategoryModalOpen(true)}
                          onFixedExpenseClick={() => setIsFixedExpenseModalOpen(true)}
                          minDate={minDateForExpenses}
                          currency={currency}
                      />
                  )}
                </div>
              </div>
          </div>
        </div>

        <CategoryModal 
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          categories={categories}
          onSelectCategory={handleSelectCategory}
          onAddCategory={onAddCategory}
          onUpdateCategory={onUpdateCategory}
          onDeleteCategory={onDeleteCategory}
        />
        <BankAccountModal
            isOpen={isBankModalOpen}
            onClose={() => setIsBankModalOpen(false)}
            bankAccounts={bankAccounts}
            onAddBankAccount={onAddBankAccount}
            onUpdateBankAccount={onUpdateBankAccount}
            onDeleteBankAccount={onDeleteBankAccount}
        />
        <BankSelectionModal
          isOpen={isBankSelectionModalOpen}
          onClose={() => setIsBankSelectionModalOpen(false)}
          bankAccounts={bankAccounts}
          balancesByMethod={balancesByMethod}
          onSelect={handleBankSelect}
          onManageBanks={() => {
            setIsBankSelectionModalOpen(false);
            setIsBankModalOpen(true);
          }}
          mode="expense"
          currency={currency}
        />
        <FixedExpenseModal
          isOpen={isFixedExpenseModalOpen}
          onClose={() => setIsFixedExpenseModalOpen(false)}
          fixedExpenses={fixedExpenses}
          categories={categories}
          onAddFixedExpense={onAddFixedExpense}
          onDeleteFixedExpense={onDeleteFixedExpense}
          onSelectFixedExpense={handleSelectFixedExpense}
          currency={currency}
        />
      </>
    );
};

export default Gastos;
