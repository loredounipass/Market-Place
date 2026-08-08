import React from 'react';
import useSearchProducts from '../hooks/useSearchProducts';

function SearchProducts() {
  const {
    loading,
    error,
    keyword,
    submittedKeyword,
    handleKeywordChange,
    handleSearchClick,
    filteredProducts
  } = useSearchProducts();

  return (
    <div className="mt-6 p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-500">Buscar Productos</h2>
      <div className="mb-6 max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Palabra clave"
            value={keyword}
            onChange={handleKeywordChange}
            className="w-full px-5 py-3 pr-28 bg-white border border-gray-200 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
          />
          <button
            onClick={handleSearchClick}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-full bg-green-500 text-white font-semibold hover:bg-green-700 transition-colors"
          >
            Buscar
          </button>
        </div>
      </div>
      {loading ? (
        <p className="text-gray-600">Cargando productos...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : submittedKeyword === '' ? (
        <p className="text-gray-600">Ingrese una palabra clave y presione Buscar.</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-gray-600">No se encontraron productos.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              className="p-5 border border-gray-200 rounded-xl overflow-hidden h-96 flex flex-col"
            >
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                {product.description && (
                  <p className="mt-2 text-sm text-gray-500 line-clamp-3">{product.description}</p>
                )}
                {product.photo && (
                  <div className="flex justify-center mt-3 h-52 overflow-hidden">
                    <img
                      src={product.photo}
                      alt={product.name}
                      className="w-full h-52 object-cover rounded cursor-default"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-green-500">Precio: ${product.price}</span>
                <button className="px-4 py-2 rounded bg-green-500 text-white font-bold hover:bg-green-700 transition-colors">
                  Contactar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchProducts;
