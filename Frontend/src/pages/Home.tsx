
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wheat, Clock, Award } from 'lucide-react';
import { productService } from '../features/products/services/productService';
import { Product } from '../types';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
      productService.getMenu().then(data => setProducts(data.slice(0, 3))).catch(console.error);
  }, []);

  return (
    <div className="pb-0">
      <section className="relative h-[85vh] flex items-center justify-start overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=2026&auto=format&fit=crop" 
            alt="Artisan Bakery" 
            className="w-full h-full object-cover brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-tlj-green/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-left">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-tight tracking-tight shadow-sm animate-fade-in">
            Welcome to <br/> Pane e Amore
          </h1>
          <p className="text-xl md:text-2xl text-tlj-cream italic font-serif mb-10 max-w-lg font-light leading-relaxed animate-fade-in delay-200">
             where every bite brings a smile!
          </p>
          <div className="animate-fade-in delay-300">
            <Link to="/menu" className="inline-block px-10 py-4 bg-tlj-green text-white rounded-full text-sm uppercase tracking-widest font-bold hover:bg-white hover:text-tlj-green transition-all duration-300 shadow-lg border-2 border-transparent hover:border-white">
              Order now!
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative order-2 lg:order-1">
                 <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative z-10">
                    <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Baker kneading dough" />
                 </div>
                 <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-tlj-green/20 z-0"></div>
              </div>
              
              <div className="order-1 lg:order-2 text-center lg:text-left">
                 <span className="text-tlj-blue font-sans text-xs font-bold tracking-widest uppercase mb-4 block">Our Philosophy</span>
                 <h2 className="text-4xl lg:text-5xl font-serif text-tlj-charcoal mb-6 leading-tight">Authentic Ingredients,<br/>Honest Baking.</h2>
                 <p className="text-gray-500 mb-8 leading-loose font-light">
                    We believe that great bread starts with great flour. That's why we partner with local millers to source the freshest grains. Our fermentation process takes 48 hours, allowing flavors to develop naturally. No shortcuts, just patience and passion.
                 </p>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-gray-100">
                    <div className="text-center">
                       <Wheat className="mx-auto text-tlj-green mb-3" size={28} />
                       <h4 className="font-serif font-bold text-tlj-charcoal">Organic Flour</h4>
                    </div>
                     <div className="text-center">
                       <Clock className="mx-auto text-tlj-green mb-3" size={28} />
                       <h4 className="font-serif font-bold text-tlj-charcoal">48h Ferment</h4>
                    </div>
                     <div className="text-center">
                       <Award className="mx-auto text-tlj-green mb-3" size={28} />
                       <h4 className="font-serif font-bold text-tlj-charcoal">Master Chefs</h4>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <section className="py-24 bg-tlj-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-tlj-green font-script text-2xl block mb-2">Seasonal Favorites</span>
            <h2 className="text-4xl font-serif font-bold text-tlj-charcoal">Fresh From The Oven</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link key={product.id} to={`/menu`} className="group block">
                <div className="bg-white p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border border-transparent hover:border-tlj-cream">
                  <div className="relative overflow-hidden aspect-square mb-6 bg-gray-50">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-serif text-xl text-tlj-charcoal mb-2 group-hover:text-tlj-green transition-colors">{product.name}</h3>
                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">{product.category}</p>
                    <span className="text-tlj-green font-bold text-lg font-serif">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
             <Link to="/menu" className="inline-flex items-center gap-2 text-tlj-charcoal hover:text-tlj-green font-sans text-sm font-bold uppercase tracking-widest border-b border-tlj-charcoal pb-1 hover:border-tlj-green transition-all">
                View All Bakery Items <ArrowRight size={16} />
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
