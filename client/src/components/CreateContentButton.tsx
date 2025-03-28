import React, { useState, useEffect, useRef } from "react";
import { Plus as PlusIcon, Image as PhotoIcon, BookOpen as BookOpenIcon } from "lucide-react";
import CreateContentModal from './CreateContentModal';

const CreateContentButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentType, setContentType] = useState<'album' | 'memory'>('album');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const openModal = (type: 'album' | 'memory') => {
    setContentType(type);
    setIsModalOpen(true);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        buttonRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <div className="fixed bottom-0 right-0 m-4 sm:m-6 z-10">
        <button
          ref={buttonRef}
          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-label="Create new content"
        >
          <PlusIcon className="h-6 w-6" />
        </button>

        {isDropdownOpen && (
          <div 
            ref={dropdownRef}
            className="absolute bottom-16 right-0 bg-gray-800 rounded-lg shadow-xl py-2 min-w-[180px] z-20"
          >
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-700 transition flex items-center gap-2"
              onClick={() => openModal('album')}
            >
              <BookOpenIcon className="h-5 w-5 text-pink-400" />
              <span>Create Album</span>
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-700 transition flex items-center gap-2"
              onClick={() => openModal('memory')}
            >
              <PhotoIcon className="h-5 w-5 text-pink-400" />
              <span>Create Memory</span>
            </button>
          </div>
        )}
      </div>

      {/* For small screens: Fixed bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 py-2 z-10">
        <div className="flex justify-around">
          <button
            className="flex flex-col items-center px-3 py-1 text-xs"
            onClick={() => openModal('album')}
          >
            <BookOpenIcon className="h-5 w-5 text-pink-400" />
            <span>New Album</span>
          </button>
          <button
            className="flex flex-col items-center px-3 py-1 text-xs"
            onClick={() => openModal('memory')}
          >
            <PhotoIcon className="h-5 w-5 text-pink-400" />
            <span>New Memory</span>
          </button>
        </div>
      </div>

      <CreateContentModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        contentType={contentType}
        onSuccess={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CreateContentButton;