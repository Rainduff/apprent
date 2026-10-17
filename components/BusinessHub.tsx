
import React, { useState } from 'react';
import { CRMCustomer, MarketPrice } from '../types';
import { Button } from './Button';
import { MOCK_CRM_CUSTOMERS, MOCK_MARKET_PRICES } from '../services/mockData';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Phone, 
  Mail, 
  Plus, 
  Search,
  BarChart3
} from 'lucide-react';

export const BusinessHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'crm' | 'prices'>('crm');
  const [customers, setCustomers] = useState<CRMCustomer[]>(MOCK_CRM_CUSTOMERS);
  const [prices] = useState<MarketPrice[]>(MOCK_MARKET_PRICES);

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Business Hub</h2>
            <p className="mt-1 text-sm text-gray-500">Manage your clients and track market trends.</p>
          </div>
          <div className="flex space-x-2">
             <Button 
               variant={activeTab === 'crm' ? 'primary' : 'outline'} 
               onClick={() => setActiveTab('crm')}
               icon={<Users size={16}/>}
             >
               CRM
             </Button>
             <Button 
               variant={activeTab === 'prices' ? 'primary' : 'outline'} 
               onClick={() => setActiveTab('prices')}
               icon={<BarChart3 size={16}/>}
             >
               Price Monitor
             </Button>
          </div>
       </div>

       {activeTab === 'crm' ? (
         <CRMView customers={customers} />
       ) : (
         <PriceMonitorView prices={prices} />
       )}
    </div>
  );
};

const CRMView = ({ customers }: { customers: CRMCustomer[] }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
         <div className="relative rounded-md shadow-sm max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" className="focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" placeholder="Search customers..." />
         </div>
         <Button size="sm" icon={<Plus size={16}/>}>Add Customer</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Potential Value</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                  <div className="text-xs text-gray-500">{customer.notes}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 flex flex-col space-y-1">
                     <span className="flex items-center"><Mail size={12} className="mr-1"/> {customer.email}</span>
                     <span className="flex items-center"><Phone size={12} className="mr-1"/> {customer.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                     ${customer.status === 'won' ? 'bg-green-100 text-green-800' : 
                       customer.status === 'lost' ? 'bg-red-100 text-red-800' : 
                       customer.status === 'negotiating' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                     {customer.status.toUpperCase()}
                   </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₦{customer.value.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-sky-600 hover:text-sky-900">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PriceMonitorView = ({ prices }: { prices: MarketPrice[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {prices.map(price => (
         <div key={price.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="font-bold text-gray-900">{price.item}</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full uppercase">{price.category}</span>
               </div>
               {price.trend === 'up' && <TrendingUp className="text-red-500" />}
               {price.trend === 'down' && <TrendingDown className="text-green-500" />}
               {price.trend === 'stable' && <Minus className="text-gray-400" />}
            </div>
            
            <div className="flex items-baseline mb-2">
               <span className="text-2xl font-bold text-gray-900">₦{price.currentPrice.toLocaleString()}</span>
               <span className="ml-2 text-sm text-gray-500 line-through">₦{price.previousPrice.toLocaleString()}</span>
            </div>
            
            <p className="text-xs text-gray-400">Last updated: {price.lastUpdated}</p>
         </div>
       ))}
    </div>
  );
};
