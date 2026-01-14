
import React, { useState, useEffect } from 'react';
import { useCart } from '../store/CartContext'; 
import { productService } from '../features/products/services/productService';
import { Product } from '../types';
import { Search } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

const Menu = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

  useEffect(() => {
      const fetchProducts = async () => {
          try {
              const data = await productService.getMenu();
              setProducts(data);
          } catch (error) {
              console.error("Failed to fetch menu", error);
          } finally {
              setLoading(false);
          }
      };
      fetchProducts();
  }, []);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const handleCategoryChange = (cat: string) => {
      setSelectedCategory(cat);
      setSearchParams(prev => {
          prev.set('category', cat);
          return prev;
      });
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearchTerm(val);
      setSearchParams(prev => {
          if (val) prev.set('search', val);
          else prev.delete('search');
          return prev;
      });
  }

  const categories = ['All', 'Bread', 'Cakes', 'Coffee', 'Milk'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory !== 'All') {
        const pCat = product.category.toLowerCase();
        if (selectedCategory === 'Cakes') {
            matchesCategory = pCat.includes('cake') || pCat.includes('pastry') || pCat.includes('cupcake');
        } else if (selectedCategory === 'Bread') {
             matchesCategory = pCat.includes('bread') || pCat.includes('baguette') || pCat.includes('toast') || pCat.includes('sourdough');
        } else if (selectedCategory === 'Coffee') {
             matchesCategory = pCat.includes('coffee') || pCat.includes('espresso');
        } else if (selectedCategory === 'Milk') {
             matchesCategory = pCat.includes('milk') || pCat.includes('tea') || pCat.includes('latte');
        } else {
             matchesCategory = product.category === selectedCategory;
        }
    }
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-tlj-cream">
      <div className="bg-[#FDFBF0] pt-16 pb-12 border-b border-[#E5E0D0]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-tlj-green font-script text-3xl mb-3 block">Our Collection</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-tlj-charcoal mb-6 tracking-tight">The Menu</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-16 border-b border-tlj-green/10 pb-8">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`text-sm md:text-base font-sans font-bold uppercase tracking-[0.2em] transition-all duration-300 relative group ${
                  selectedCategory === cat ? 'text-tlj-green' : 'text-gray-400 hover:text-tlj-charcoal'
                }`}
              >
                {cat}
                <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-tlj-green transform origin-left transition-transform duration-300 ${
                    selectedCategory === cat ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
                }`}></span>
              </button>
            ))}
          </div>

          <div className="hidden md:block w-px h-8 bg-gray-200"></div>

          <div className="relative group w-full md:w-64">
            <input 
              type="text" 
              placeholder="SEARCH ITEMS" 
              className="w-full bg-transparent border-b border-gray-300 focus:border-tlj-green py-2 pl-0 pr-8 text-xs font-bold uppercase tracking-widest text-tlj-charcoal placeholder-gray-400 outline-none transition-colors"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-tlj-green transition-colors" size={16} />
          </div>
        </div>

        {loading ? (
            <div className="text-center py-20 text-gray-500 animate-pulse">Loading fresh items...</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {filteredProducts.map((product) => (
                <div key={product.id} className="group flex flex-col items-center">
                <Link to={`/product/${product.id}`} className="block relative w-full aspect-square overflow-hidden bg-white mb-6 cursor-pointer shadow-sm group-hover:shadow-md transition-shadow duration-500">
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
                    <button 
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className={`mt-4 text-[10px] font-bold uppercase tracking-widest border px-4 py-2 transition-all
                            ${product.stock > 0 
                                ? 'text-gray-400 hover:text-tlj-green border-transparent hover:border-tlj-green' 
                                : 'text-gray-300 border-gray-100 cursor-not-allowed'}
                        `}
                    >
                        + Add to Cart
                    </button>
                </div>
                </div>
            ))}
            </div>
        )}
        
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-32">
            <h3 className="text-2xl font-serif text-gray-400 italic">No items found matching "{searchTerm}" in {selectedCategory}.</h3>
            <button 
                onClick={() => {setSearchTerm(''); setSelectedCategory('All'); setSearchParams({}); }}
                className="mt-4 text-tlj-green underline font-bold"
            >
                Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
