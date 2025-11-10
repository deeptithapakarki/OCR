
// App.tsx
import React, { useState, useCallback } from 'react';
import { Contact } from './types';
import { fileToBase64 } from './utils/fileUtils';
import { extractContactsFromImage } from './services/geminiService';
import { ImageUploader } from './components/ImageUploader';
import { ContactTable } from './components/ContactTable';
import { ActionButtons } from './components/ActionButtons';
import { SpinnerIcon } from './components/icons';

const App: React.FC = () => {
  // State for the uploaded image file and its URL for preview.
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // State for the extracted contacts.
  const [contacts, setContacts] = useState<Contact[]>([]);
  
  // State for managing loading, success, and error messages.
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // This function is the core logic for processing the image.
  const handleExtractContacts = useCallback(async (file: File) => {
    // 1. Reset the state for a new request.
    setIsLoading(true);
    setContacts([]);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // 2. Convert the image file to a base64 string.
      const base64Image = await fileToBase64(file);
      
      // 3. Call the Gemini service to extract contacts.
      const extractedData = await extractContactsFromImage(base64Image, file.type);

      // 4. Update state with the results.
      if (extractedData && extractedData.length > 0) {
        setContacts(extractedData);
        setSuccessMessage('Contacts extracted successfully!');
      } else {
        setErrorMessage('No contacts were found in the image.');
      }
    } catch (error) {
      // 5. Handle any errors during the process.
      console.error(error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      setErrorMessage(message);
    } finally {
      // 6. Ensure loading is always turned off.
      setIsLoading(false);
    }
  }, []);
  
  // This function handles the file upload from the ImageUploader component.
  const handleImageUpload = useCallback((file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    // Automatically start the extraction process upon upload.
    handleExtractContacts(file);
  }, [handleExtractContacts]);


  // This function resets the entire application to its initial state.
  const handleClearAll = () => {
    setImageFile(null);
    setImageUrl(null);
    setContacts([]);
    setIsLoading(false);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <main className="container mx-auto max-w-4xl w-full">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 space-y-8">
          
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
              Image to Contact Extractor
            </h1>
            <p className="mt-2 text-md text-slate-600">
              Upload an image of a contact list, and let AI do the organizing for you.
            </p>
          </div>

          {/* Uploader and Status Section */}
          <div className="space-y-6">
            <ImageUploader 
              onImageUpload={handleImageUpload}
              imageUrl={imageUrl}
              isLoading={isLoading}
            />
            
            {/* Display loading, success, or error messages */}
            {isLoading && (
              <div className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg">
                <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
                <span>Analyzing image, please wait...</span>
              </div>
            )}
            {successMessage && !isLoading && (
              <div className="p-4 bg-green-50 text-green-700 font-semibold rounded-lg text-center">
                {successMessage}
              </div>
            )}
            {errorMessage && !isLoading && (
              <div className="p-4 bg-red-50 text-red-700 font-semibold rounded-lg text-center">
                {errorMessage}
              </div>
            )}
          </div>
          
          {/* Action Buttons and Results Table */}
          {contacts.length > 0 && !isLoading && (
            <div className="space-y-6">
              <ActionButtons contacts={contacts} onClear={handleClearAll} />
              <ContactTable contacts={contacts} />
            </div>
          )}

          {/* Add a clear button if there's an image but no results, or an error */}
          {(errorMessage || (imageUrl && contacts.length === 0)) && !isLoading && (
             <div className="flex justify-center">
                 <button 
                    onClick={handleClearAll}
                    className="px-6 py-2 bg-slate-600 text-white font-semibold rounded-md shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200"
                >
                    Start Over
                </button>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
