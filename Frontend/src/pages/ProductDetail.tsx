
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../features/products/services/productService';
import { Product } from '../types';
import { useCart } from '../store/CartContext';
import { ArrowLeft, Minus, Plus, ShoppingBag, Wheat } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
        for(let i=0; i<quantity; i++) {
            addToCart(product);
        }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-tlj-cream">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center bg-tlj-cream text-2xl font-serif">Product Not Found</div>;

  return (
    <div className="min-h-screen bg-tlj-cream py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-2 text-sm uppercase tracking-widest text-gray-500">
            <Link to="/menu" className="hover:text-tlj-green transition-colors">Menu</Link> 
            <span>&gt;</span>
            <span className="text-tlj-green font-bold">{product.name}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#E5E0D0]">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                
                <div className="relative bg-[#FAFAFA] p-8 flex items-center justify-center min-h-[500px]">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-auto max-w-lg object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500" 
                    />
                </div>

                <div className="p-8 lg:p-16 flex flex-col h-full">
                    <h1 className="text-4xl lg:text-5xl font-serif font-bold text-tlj-charcoal mb-6 leading-tight">
                        {product.name}
                    </h1>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-12 border-b border-gray-100 pb-12">
                        <span className="text-3xl font-sans font-bold text-tlj-green">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </span>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-tlj-green"><Minus size={18}/></button>
                                <span className="mx-4 font-bold w-4 text-center">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="text-gray-500 hover:text-tlj-green"><Plus size={18}/></button>
                            </div>
                            <button 
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm shadow-lg flex items-center gap-2 transition-all
                                    ${product.stock > 0 ? 'bg-tlj-green text-white hover:bg-tlj-charcoal hover:-translate-y-1' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                                `}
                            >
                                <ShoppingBag size={18} /> {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div>
                            <h3 className="font-serif text-2xl font-bold text-tlj-charcoal mb-4">
                                Nutritional Information <span className="text-sm font-sans font-normal text-gray-500 block sm:inline">| Per Serving</span>
                            </h3>
                            <div className="border-t border-b border-gray-200">
                                {product.nutritionInfo ? (
                                    <table className="w-full text-sm">
                                        <tbody className="divide-y divide-gray-100">
                                            <tr className="flex justify-between py-3">
                                                <td className="font-bold text-gray-700">Calories</td>
                                                <td className="text-gray-600">{product.nutritionInfo.calories || '-'}</td>
                                            </tr>
                                            <tr className="flex justify-between py-3">
                                                <td className="text-gray-700">Total Fat (g)</td>
                                                <td className="text-gray-600">{product.nutritionInfo.totalFat || '-'}</td>
                                            </tr>
                                            <tr className="flex justify-between py-3">
                                                <td className="text-gray-700 pl-4">Saturated Fat (g)</td>
                                                <td className="text-gray-600">{product.nutritionInfo.saturatedFat || '-'}</td>
                                            </tr>
                                            <tr className="flex justify-between py-3">
                                                <td className="text-gray-700 pl-4">Trans Fat (g)</td>
                                                <td className="text-gray-600">{product.nutritionInfo.transFat || '-'}</td>
                                            </tr>
                                            <tr className="flex justify-between py-3">
                                                <td className="text-gray-700">Total Carbohydrate (g)</td>
                                                <td className="text-gray-600">{product.nutritionInfo.totalCarbs || '-'}</td>
                                            </tr>
                                            <tr className="flex justify-between py-3">
                                                <td className="text-gray-700 pl-4">Total Sugar (g)</td>
                                                <td className="text-gray-600">{product.nutritionInfo.totalSugar || '-'}</td>
                                            </tr>
                                            <tr className="flex justify-between py-3">
                                                <td className="text-gray-700">Protein (g)</td>
                                                <td className="text-gray-600">{product.nutritionInfo.protein || '-'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="py-4 text-gray-400 italic">Nutritional information not available.</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-serif text-xl font-bold text-tlj-charcoal mb-3 uppercase tracking-widest border-b border-tlj-green/20 pb-2 inline-block">
                                Ingredients
                            </h3>
                            <p className="text-gray-600 leading-relaxed font-light">
                                {product.ingredients || "Ingredients not listed."}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
