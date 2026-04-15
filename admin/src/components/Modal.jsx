import React from 'react'

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed top-0 right-0 left-0 bottom-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-black/50 bg-opacity-50 backdrop-blur-xs'>
        <div className="relative p-4 w-full max-w-3xl max-h-full">
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow-sm ">
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 ">
                        {title}
                    </h3>

                    <button 
                        onClick={onClose}
                        type='button'
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal body */}
                <div className="p-4 md:p-5 space-y-4 ">
                    {children}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Modal