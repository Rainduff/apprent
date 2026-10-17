import React, { useState } from 'react';
import { Transaction, User } from '../types';
import { Button } from './Button';
import { Modal } from './Modal';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ExternalLink, 
  Scale, 
  Droplets,
  CreditCard,
  History
} from 'lucide-react';

interface WalletViewProps {
  user: User;
  transactions: Transaction[];
  trustPoolBalance: number;
  onDeposit: (amount: number) => void;
}

export const WalletView: React.FC<WalletViewProps> = ({ user, transactions, trustPoolBalance, onDeposit }) => {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<string>('50000');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = () => {
    const amount = parseInt(depositAmount.replace(/,/g, ''), 10);
    if (isNaN(amount) || amount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      onDeposit(amount);
      setIsProcessing(false);
      setIsDepositModalOpen(false);
    }, 1500);
  };

  // Calculate stats based on real transactions and user data
  const escrowLocked = 40000; // In a full app this would be summed from active enrollments
  
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5 flex flex-col md:flex-row md:items-center md:justify-between">
         <div>
           <h3 className="text-2xl font-bold leading-6 text-gray-900 flex items-center">
             <span className="text-sky-500 mr-2 text-3xl">🌊</span> AquaFlow Wallet
           </h3>
           <p className="mt-2 text-sm text-gray-500">
             "Where fairness flows like water." - Amos 5:24
           </p>
         </div>
         <div className="mt-4 md:mt-0 flex space-x-3">
           <Button variant="outline" icon={<ArrowDownLeft size={16}/>} onClick={() => setIsDepositModalOpen(true)}>Deposit</Button>
           <Button variant="primary" icon={<ArrowUpRight size={16}/>} onClick={() => alert("Withdrawal feature coming in Sprint 2")}>Withdraw</Button>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Main Balance Card with Water Flow Animation */}
        <div className="rounded-2xl overflow-hidden shadow-lg text-white relative group bg-sky-600">
          <div className="absolute inset-0 water-flow opacity-90 transition-opacity duration-1000"></div>
          <div className="relative p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sky-100 font-medium text-sm">Total Balance</p>
                <h3 className="text-3xl font-bold mt-1">₦{user.balance.toLocaleString()}</h3>
              </div>
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <CreditCard className="text-white h-6 w-6" />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center text-sm">
               <span className="text-sky-50">Available to Withdraw</span>
               <span className="font-semibold">₦{(Math.max(0, user.balance - escrowLocked)).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Escrow Status Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
           <div className="flex justify-between items-start mb-4">
             <div>
               <p className="text-gray-500 font-medium text-sm">Escrow Locked</p>
               <h3 className="text-2xl font-bold text-gray-900 mt-1">₦{escrowLocked.toLocaleString()}</h3>
             </div>
             <div className="bg-amber-100 p-2 rounded-lg">
               <Scale className="text-amber-600 h-6 w-6" />
             </div>
           </div>
           <p className="text-xs text-gray-500 italic">"Transparent measures — see every Naira accounted for"</p>
           <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
             <div className="bg-amber-500 h-2 rounded-full" style={{ width: '60%' }}></div>
           </div>
           <div className="flex justify-between text-xs text-gray-400 mt-1">
             <span>Released: ₦10,000</span>
             <span>Total: ₦50,000</span>
           </div>
        </div>

        {/* Trust Pool Impact */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-lg p-6 border border-emerald-100">
           <div className="flex justify-between items-start mb-4">
             <div>
               <p className="text-emerald-700 font-medium text-sm">Community Trust Pool</p>
               <h3 className="text-2xl font-bold text-emerald-900 mt-1">₦{trustPoolBalance.toLocaleString()}</h3>
             </div>
             <div className="bg-emerald-200 p-2 rounded-lg">
               <Droplets className="text-emerald-700 h-6 w-6" />
             </div>
           </div>
           <p className="text-xs text-emerald-600 mb-3">
             "1% flows back to lift others, a just portion."
           </p>
           <div className="text-sm text-emerald-800 bg-emerald-100 p-3 rounded-lg">
             <strong>Your Contribution:</strong> ₦{(user.role === 'OGA' ? 200 : 0).toLocaleString()} this month
           </div>
        </div>
      </div>

      {/* Ledger */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <History className="mr-2 h-5 w-5 text-gray-400"/> Transaction Ledger
          </h3>
          <Button variant="ghost" size="sm">Download CSV</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hash</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.slice().reverse().map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${tx.type === 'deposit' ? 'bg-green-100 text-green-800' : 
                        tx.type === 'withdrawal' ? 'bg-gray-100 text-gray-800' : 
                        tx.type === 'trust_pool_fee' ? 'bg-purple-100 text-purple-800' : 
                        'bg-sky-100 text-sky-800'}`}>
                      {tx.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.description}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${tx.type === 'deposit' || tx.type === 'release' ? 'text-green-600' : 'text-gray-900'}`}>
                    {tx.type === 'deposit' || tx.type === 'release' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     {tx.status === 'success' ? (
                       <span className="text-green-600 flex items-center text-xs uppercase font-bold tracking-wide"><div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div> Success</span>
                     ) : (
                       <span className="text-amber-600 flex items-center text-xs uppercase font-bold tracking-wide"><div className="w-2 h-2 bg-amber-500 rounded-full mr-1"></div> Pending</span>
                     )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href={`https://mumbai.polygonscan.com/tx/${tx.hash}`} target="_blank" rel="noreferrer" className="text-sky-600 hover:text-sky-900 inline-flex items-center">
                      View <ExternalLink size={12} className="ml-1" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isDepositModalOpen} 
        onClose={() => setIsDepositModalOpen(false)} 
        title="Fund Your Wallet"
      >
         <div className="space-y-4">
            <p className="text-sm text-gray-500">Add funds securely via Paystack (Sandbox). Your funds are safe and will only be released to the escrow when you enroll in a course.</p>
            
            <div>
               <label className="block text-sm font-medium text-gray-700">Amount (NGN)</label>
               <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <span className="text-gray-500 sm:text-sm">₦</span>
                 </div>
                 <input
                   type="number"
                   name="amount"
                   className="focus:ring-sky-500 focus:border-sky-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2 border"
                   placeholder="0.00"
                   value={depositAmount}
                   onChange={(e) => setDepositAmount(e.target.value)}
                 />
                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                   <span className="text-gray-500 sm:text-sm">NGN</span>
                 </div>
               </div>
            </div>

            <div className="bg-gray-50 p-3 rounded text-xs text-gray-500">
               <p><strong>Security Note:</strong> We use industry-standard encryption. Your card details are never stored on our servers.</p>
            </div>

            <div className="mt-5 sm:mt-6">
              <Button onClick={handleDeposit} isLoading={isProcessing} className="w-full justify-center">
                Pay Securely with Paystack
              </Button>
            </div>
         </div>
      </Modal>
    </div>
  );
};
