
// utils/fileUtils.ts
import { Contact } from '../types';

/**
 * Converts a File object into a base64 encoded string.
 * @param file The image file to convert.
 * @returns A promise that resolves with the base64 string (without the data URL prefix).
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Result is a data URL like "data:image/jpeg;base64,..."
      // We only need the part after the comma.
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Converts an array of Contact objects to a CSV formatted string.
 * @param contacts The array of contacts to convert.
 * @returns A string in CSV format.
 */
const convertToCSV = (contacts: Contact[]): string => {
  if (contacts.length === 0) {
    return "";
  }
  
  // Define the headers for the CSV file.
  const headers = ['Name', 'Company', 'Location', 'Email', 'Phone'];
  const csvRows = [headers.join(',')];

  // Helper function to escape commas within a value.
  const escapeCsvValue = (value: string | null | undefined): string => {
    if (value === null || value === undefined) {
      return '';
    }
    const strValue = String(value);
    // If the value contains a comma, quote, or newline, wrap it in double quotes.
    if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
      return `"${strValue.replace(/"/g, '""')}"`;
    }
    return strValue;
  };
  
  // Map each contact object to a CSV row.
  for (const contact of contacts) {
    const values = [
      escapeCsvValue(contact.name),
      escapeCsvValue(contact.company),
      escapeCsvValue(contact.location),
      escapeCsvValue(contact.email),
      escapeCsvValue(contact.phone),
    ];
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};


/**
 * Triggers a browser download for the given contacts as a CSV file.
 * @param contacts The array of contacts to download.
 * @param filename The desired name of the downloaded file (e.g., "contacts.csv").
 */
export const downloadCSV = (contacts: Contact[], filename: string) => {
  const csvString = convertToCSV(contacts);
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
