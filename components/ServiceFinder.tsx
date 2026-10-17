
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Button } from './Button';
import { Search, Star, MapPin, Briefcase, Award } from 'lucide-react';
import { MOCK_USERS } from '../services/mockData';

export const ServiceFinder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter users who are verified and have skills (Ogas or Skilled Apprentices)
  const workers = MOCK_USERS.filter(u => 
    (u.role === UserRole.OGA || (u.role === UserRole.APPRENTICE && u.skills && u.skills.length > 0)) &&
    (searchTerm === '' || 
     u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     u.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Find Verified Artisans</h2>
          <p className="mt-2 text-gray-500">Connect with skilled master craftsmen and verified apprentices in your area.</p>
          
          <div className="mt-6 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              className="focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 py-3 sm:text-lg border-gray-300 rounded-full border shadow-sm" 
              placeholder="Try 'Plumber', 'Tailor', or 'Developer'..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map(worker => (
             <div key={worker.id} className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:border-sky-300 transition-colors flex flex-col">
                <div className="flex items-start justify-between mb-4">
                   <div className="flex items-center">
                      <img src={worker.avatar || `https://ui-avatars.com/api/?name=${worker.name}`} alt={worker.name} className="h-12 w-12 rounded-full bg-gray-200" />
                      <div className="ml-3">
                         <h3 className="text-lg font-bold text-gray-900">{worker.name}</h3>
                         <p className="text-xs text-gray-500">{worker.businessName || 'Freelancer'}</p>
                      </div>
                   </div>
                   <div className="flex items-center bg-amber-50 px-2 py-1 rounded text-amber-700 text-xs font-bold">
                      <Star size={12} className="mr-1 fill-current" /> {worker.rating || 'N/A'}
                   </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{worker.bio || "No bio available."}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                   {worker.skills?.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-sky-50 text-sky-700 text-xs rounded-md">{skill}</span>
                   ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3 mt-auto">
                   <span className="flex items-center"><MapPin size={12} className="mr-1"/> {worker.location || 'Nigeria'}</span>
                   <span className="font-bold text-gray-900">₦{worker.hourlyRate ? worker.hourlyRate.toLocaleString() : 'Negotiable'}/hr</span>
                </div>
                
                <div className="mt-4 flex space-x-2">
                   <Button className="flex-1" size="sm">Contact</Button>
                   <Button variant="outline" size="sm">View Profile</Button>
                </div>
             </div>
          ))}
          {workers.length === 0 && (
             <div className="col-span-full text-center py-12 text-gray-500">
                <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-2"/>
                <p>No artisans found matching your search.</p>
             </div>
          )}
       </div>
    </div>
  );
};
