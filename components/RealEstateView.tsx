
import React, { useState } from 'react';
import { Property, User } from '../types';
import { Button } from './Button';
import { Modal } from './Modal';
import { MapPin, BedDouble, Bath, Home, Search, CheckCircle } from 'lucide-react';

interface RealEstateViewProps {
  properties: Property[];
  onBuy: (property: Property) => void;
}

export const RealEstateView: React.FC<RealEstateViewProps> = ({ properties, onBuy }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleConfirmPurchase = () => {
    if (selectedProperty) {
      onBuy(selectedProperty);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
             <h2 className="text-2xl font-bold text-gray-900">Real Estate Marketplace</h2>
             <p className="mt-1 text-sm text-gray-500">Find homes, shops, and land. Secure payment via AquaFlow Escrow.</p>
          </div>
          <div className="mt-4 md:mt-0 relative rounded-md shadow-sm max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" className="focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" placeholder="Search location or type..." />
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(property => (
            <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">
               <div className="h-48 relative overflow-hidden">
                  <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold text-white uppercase shadow ${property.type === 'sale' ? 'bg-emerald-600' : 'bg-sky-600'}`}>
                     For {property.type}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-bold">
                     ₦{property.price.toLocaleString()}
                  </div>
               </div>
               <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{property.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center mb-3"><MapPin size={14} className="mr-1"/> {property.location}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-600 mb-4 border-b border-gray-100 pb-3">
                     <span className="flex items-center"><BedDouble size={14} className="mr-1 text-sky-500"/> {property.bedrooms} Bed</span>
                     <span className="flex items-center"><Bath size={14} className="mr-1 text-sky-500"/> {property.bathrooms} Bath</span>
                     <span className="flex items-center"><Home size={14} className="mr-1 text-sky-500"/> {property.type === 'lease' ? 'Yearly' : 'Freehold'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                     <span className="text-xs text-gray-400">Agent: {property.agentName}</span>
                     <Button size="sm" onClick={() => handleSelect(property)}>View Details</Button>
                  </div>
               </div>
            </div>
          ))}
       </div>

       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Property Details">
          {selectedProperty && (
            <div className="space-y-4">
               <img src={selectedProperty.imageUrl} className="w-full h-48 object-cover rounded-lg" alt={selectedProperty.title} />
               <div>
                  <h3 className="text-xl font-bold">{selectedProperty.title}</h3>
                  <p className="text-sky-600 font-bold text-lg">₦{selectedProperty.price.toLocaleString()}</p>
                  <p className="text-gray-500 text-sm mt-2">{selectedProperty.description}</p>
               </div>
               <div className="bg-sky-50 p-4 rounded-lg text-sm border border-sky-100">
                  <p className="font-bold text-sky-800 mb-1">Escrow Protection</p>
                  <p className="text-sky-700">Your payment will be held in the AquaFlow Trust Pool until you inspect the property and confirm satisfaction.</p>
               </div>
               <Button className="w-full" onClick={handleConfirmPurchase}>Pay & Reserve</Button>
            </div>
          )}
       </Modal>
    </div>
  );
};
