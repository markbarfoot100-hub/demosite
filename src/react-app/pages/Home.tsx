import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Sparkles, Leaf, Award, Shield } from 'lucide-react';
import { Product } from '@/shared/types';
import ProductCard from '@/react-app/components/ProductCard';
import Header from '@/react-app/components/Header';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setFeaturedProducts(data.products?.slice(0, 3) || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://mocha-cdn.com/019a2ada-c91b-7c1b-9da0-94076d92107c/hero-psychedelic-cannabis.jpg)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        
        {/* Static Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl" />
        <div className="absolute bottom-40 right-20 w-32 h-32 bg-green-500/20 rounded-full blur-2xl" />
        <div className="absolute top-60 right-40 w-16 h-16 bg-pink-500/30 rounded-full blur-lg" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="font-cosmic-bold text-6xl md:text-8xl text-white mb-6 cosmic-text-glow">
            Medical
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-green-400 bg-clip-text text-transparent">
              Cannabis
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Explore premium medical marijuana in a psychedelic journey through consciousness. 
            Quality products for your cosmic experience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/products"
              className="group flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-full text-white font-cosmic hover:from-purple-700 hover:to-pink-700 transition-all cosmic-glow"
            >
              <Sparkles className="w-5 h-5" />
              <span>Explore Products</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-950/20">
        <div className="container mx-auto px-6">
          <h2 className="font-cosmic text-4xl md:text-5xl text-center text-white mb-16">
            Why Choose <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Cosmic</span>?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 cosmic-glow group-hover:subtle-glow-animation transition-all">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-cosmic text-xl text-white mb-4">Premium Quality</h3>
              <p className="text-gray-300">Lab-tested, organic cannabis products sourced from the finest growers.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 cosmic-glow-green group-hover:subtle-glow-animation transition-all">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-cosmic text-xl text-white mb-4">Diverse Selection</h3>
              <p className="text-gray-300">From flowers to edibles, find the perfect product for your journey.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 cosmic-glow group-hover:subtle-glow-animation transition-all">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-cosmic text-xl text-white mb-4">Medical Grade</h3>
              <p className="text-gray-300">Licensed medical marijuana dispensary with full compliance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-purple-950/20 to-black">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-cosmic text-4xl md:text-5xl text-white mb-6">
                Featured <span className="bg-gradient-to-r from-green-400 to-pink-400 bg-clip-text text-transparent">Products</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Discover our most popular strains and products, carefully curated for the ultimate cosmic experience.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12 min-h-[400px]">
              {loading ? (
                // Loading placeholders to prevent layout shift
                Array.from({length: 3}).map((_, index) => (
                  <div key={index} className="bg-cosmic-card rounded-2xl p-6 cosmic-glow animate-pulse">
                    <div className="bg-gray-700 h-48 rounded-xl mb-4"></div>
                    <div className="bg-gray-700 h-6 rounded mb-2"></div>
                    <div className="bg-gray-700 h-4 rounded mb-4"></div>
                    <div className="bg-gray-700 h-8 rounded"></div>
                  </div>
                ))
              ) : (
                featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
            
            <div className="text-center">
              <Link
                to="/products"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-600 to-purple-600 px-8 py-4 rounded-full text-white font-cosmic hover:from-green-700 hover:to-purple-700 transition-all cosmic-glow-green"
              >
                <span>View All Products</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black/80 border-t border-purple-500/30 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="https://mocha-cdn.com/019a2ada-c91b-7c1b-9da0-94076d92107c/logo-psychedelic-leaf.png"
              alt="Cosmic Cannabis"
              className="w-8 h-8 object-contain"
            />
            <h3 className="font-cosmic text-xl text-white cosmic-text-glow">Cosmic Cannabis</h3>
          </div>
          <p className="text-gray-400 mb-4">Premium Medical Marijuana Dispensary</p>
          <p className="text-xs text-gray-500">
            For medical use only. Must be 21+ with valid medical marijuana card.
          </p>
        </div>
      </footer>
    </div>
  );
}
