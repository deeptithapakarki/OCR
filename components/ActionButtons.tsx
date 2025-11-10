
// components/ActionButtons.tsx
import React, { useState } from 'react';
import { Contact } from '../types';
import { downloadCSV } from '../utils/fileUtils';
import { CopyIcon, DownloadIcon, ClearIcon } from './icons';

interface ActionButtonsProps {
  contacts: Contact[];
  onClear: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ contacts, onClear }) => {
  const [copyText, setCopyText] = useState('Copy CSV');

  const handleCopyToClipboard = () => {
    // Generate CSV content from contacts array.
    const headers = ['Name', 'Company', 'Location', 'Email', 'Phone'];
    const csvRows = [headers.join(',')];
    contacts.forEach(contact => {
        const values = [contact.name, contact.company, contact.location, contact.email, contact.phone].map(v => `"${v || ''}"`);
        csvRows.push(values.join(','));
    });
    const csvContent = csvRows.join('\n');
    
    // Use navigator API to copy to clipboard.
    navigator.clipboard.writeText(csvContent).then(() => {
        setCopyText('Copied!');
        setTimeout(() => setCopyText('Copy CSV'), 2000); // Revert text after 2 seconds.
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        setCopyText('Failed to copy');
        setTimeout(() => setCopyText('Copy CSV'), 2000);
    });
  };

  const handleDownloadCSV = () => {
    downloadCSV(contacts, 'extracted_contacts.csv');
  };
  
  // Do not render if there are no contacts to act upon.
  if (contacts.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-wrap gap-4 justify-center md:justify-end">
      <button 
        onClick={handleCopyToClipboard}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
      >
        <CopyIcon className="w-5 h-5" />
        {copyText}
      </button>
      <button 
        onClick={handleDownloadCSV}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
      >
        <DownloadIcon className="w-5 h-5" />
        Download CSV
      </button>
      <button 
        onClick={onClear}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
      >
        <ClearIcon className="w-5 h-5" />
        Clear All
      </button>
    </div>
  );
};
