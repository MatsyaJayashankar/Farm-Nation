  //  export const Modal=(showModal,selectedProduct)=>{

  //  }
  //  {/* Product Details Modal */}
  //     {showModal && selectedProduct && (
  //       <div
  //         className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 overflow-auto font-inter"
  //         onClick={closeProductDetails} // Close modal when clicking outside
  //       >
  //         <div
  //           className="bg-gray-800 text-white rounded-lg shadow-2xl p-6 relative w-full max-w-lg mx-auto transform transition-all duration-300 scale-95 opacity-0 animate-scale-in"
  //           onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal content
  //         >
  //           {/* Close button */}
  //           <button
  //             className="absolute top-3 right-3 text-gray-400 hover:text-white text-3xl font-bold leading-none"
  //             onClick={closeProductDetails}
  //           >
  //             &times;
  //           </button>

  //           <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
  //             <img
  //               src={selectedProduct.image || `https://placehold.co/200x200/CCCCCC/000000?text=No+Image`} // Use selectedProduct.image or fallback
  //               alt={selectedProduct.name}
  //               className="w-48 h-48 object-cover rounded-lg shadow-lg flex-shrink-0"
  //               onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/200x200/CCCCCC/000000?text=No+Image`; }} // Fallback for broken images
  //             />
  //             <div className="text-center md:text-left">
  //               <h2 className="text-3xl font-extrabold mb-2 text-amber-300">
  //                 {selectedProduct.name}
  //               </h2>
  //               <p className="text-lg mb-4 text-gray-300">
  //                 {selectedProduct.description || "No description available."}
  //               </p>
  //               <p className="text-2xl font-bold text-green-400 mb-4">
  //                 Price: ${(typeof selectedProduct.price === 'number' ? selectedProduct.price : 0).toFixed(2)}
  //               </p>
  //               <div className="flex justify-center md:justify-start gap-4 mt-4">
  //                 <button
  //                   className="bg-blue-600 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
  //                   onClick={() => {
  //                     addToCart(selectedProduct.id);
  //                     closeProductDetails(); // Optionally close after adding to cart
  //                   }}
  //                 >
  //                   Add to Cart
  //                 </button>
  //                 <button
  //                   className="bg-red-600 text-white py-2 px-4 rounded-full shadow-lg hover:bg-red-700 transition-colors duration-200"
  //                   onClick={() => {
  //                     removeFromCart(selectedProduct.id);
  //                     closeProductDetails(); // Optionally close after removing
  //                   }}
  //                 >
  //                   Remove from Cart
  //                 </button>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     )}

  //     {/* Custom CSS for modal animation */}
  //     <style>{`
  //       @keyframes scale-in {
  //         from {
  //           transform: scale(0.95);
  //           opacity: 0;
  //         }
  //         to {
  //           transform: scale(1);
  //           opacity: 1;
  //         }
  //       }
  //       .animate-scale-in {
  //         animation: scale-in 0.2s ease-out forwards;
  //       }
  //       /* Ensure Inter font is used */
  //       .font-inter {
  //           font-family: 'Inter', sans-serif;
  //       }
  //     `}</style>
