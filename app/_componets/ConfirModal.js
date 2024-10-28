import React, { useEffect, useRef } from "react";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  const modalRef = useRef(null); // Create a ref for the modal

  // Function to handle clicks outside the modal
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onCancel(); // Close the modal if clicked outside
    }
  };

  useEffect(() => {
    // Add event listener to detect clicks
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef} // Attach the ref to the modal
        className="bg-white p-6 rounded-lg shadow-lg text-center"
      >
        <h2 className="text-lg font-semibold mb-4">{message}</h2>
        <div className="flex justify-around">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
