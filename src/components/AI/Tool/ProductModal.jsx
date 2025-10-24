import React from 'react';
import { Dialog } from '@headlessui/react';
import { FiX } from 'react-icons/fi';
import { FaRegStar, FaStar } from 'react-icons/fa';

const ProductModal = ({ product, onClose, isFavorite, toggleFavorite }) => {
  return (
    <Dialog open={!!product} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="bg-white rounded-xl p-6 w-96 max-w-full shadow-2xl relative mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <FiX size={20} />
        </button>
        <Dialog.Title className="text-lg font-semibold text-gray-800">{product.name}</Dialog.Title>
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mt-2" />
        <p className="text-sm text-gray-600 mt-2">{product.brand}</p>
        <p className="text-sm text-gray-500 mt-1">{product.description}</p>
        <div className="mt-2">
          <span className="text-sm font-semibold text-indigo-600">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="ml-2 line-through text-gray-400 text-xs">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex mt-2 space-x-2">
          {product.colors.map((color, index) => (
            <div key={index} className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: color }} />
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          <p>Width: {product.dimensions.width} cm</p>
          <p>Height: {product.dimensions.height} cm</p>
          <p>Depth: {product.dimensions.depth} cm</p>
        </div>
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => {
              toggleFavorite(product.id);
            }}
            className={`flex-1 border py-2 rounded-lg transition flex items-center justify-center ${
              isFavorite ? 'border-yellow-400 text-yellow-600 bg-yellow-50' : 'border-indigo-600 text-indigo-600'
            }`}
          >
            {isFavorite ? (
              <>
                <FaStar className="mr-2 text-yellow-400" /> Saved
              </>
            ) : (
              <>
                <FaRegStar className="mr-2" /> Save
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ProductModal;