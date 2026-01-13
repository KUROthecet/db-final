
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productService } from '../features/products/services/productService';
import { Product } from '../types';
import { useCart } from '../store/CartContext';
import { Search, ArrowRight } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
          setProducts([]);
          setLoading(false);
          return;
      }
      setLoading(true);
      try {
        const data = await productService.searchProducts(query);
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-tlj-cream">
        <div className="bg-[#FDFBF0] pt-12 pb-8 border-b border-[#E5E0D0]">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-serif font-bold text-tlj-charcoal">
                    Search Results for <span className="text-tlj-green italic">"{query}"</span>
                </h1>
                <p className="text-gray-500 mt-2">{products.length} result(s) found</p>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
            {loading ? (
                <div className="text-center py-20">
                    <div className="w-10 h-10 border-4 border-tlj-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Searching the bakery...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <Search size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">No cakes found</h2>
                    <p className="text-gray-500 mb-6">We couldn't find anything matching "{query}". Try a different keyword.</p>
                    <Link to="/menu" className="inline-flex items-center gap-2 text-tlj-green font-bold uppercase tracking-widest hover:underline">
                        View Full Menu <ArrowRight size={16} />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                    {products.map((product) => (
                        <div key={product.id} className="group flex flex-col items-center">
                            <Link to={`/product/${product.id}`} className="relative block w-full aspect-square overflow-hidden bg-white mb-6 cursor-pointer shadow-sm group-hover:shadow-md transition-shadow duration-500">
                                <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                
                                {product.stock === 0 && (
                                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                    <span className="bg-tlj-charcoal text-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest">
                                    Sold Out
                                    </span>
                                </div>
                                )}

                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 bg-gradient-to-t from-black/20 to-transparent">
                                    <span className="bg-white text-tlj-green px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg">View Details</span>
                                </div>
                            </Link>

                            <div className="text-center w-full px-2">
                                <Link to={`/product/${product.id}`} className="block font-serif text-lg text-tlj-charcoal mb-2 leading-tight group-hover:text-tlj-green transition-colors">
                                {product.name}
                                </Link>
                                <div className="w-8 h-px bg-tlj-green/30 mx-auto mb-3"></div>
                                <div className="flex justify-center items-center gap-2">
                                <span className="font-sans font-bold text-tlj-charcoal text-lg">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default SearchResults;
