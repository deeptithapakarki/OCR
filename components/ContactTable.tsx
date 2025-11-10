
// components/ContactTable.tsx
import React from 'react';
import { Contact } from '../types';

interface ContactTableProps {
  contacts: Contact[];
}

export const ContactTable: React.FC<ContactTableProps> = ({ contacts }) => {
  if (contacts.length === 0) {
    return null; // Don't render anything if there are no contacts to show.
  }
  
  const headers = ['Name', 'Company', 'Location', 'Email', 'Phone'];

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-100">
            <tr>
              {headers.map((header) => (
                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {contacts.map((contact, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{contact.name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{contact.company || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{contact.location || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{contact.email || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{contact.phone || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
