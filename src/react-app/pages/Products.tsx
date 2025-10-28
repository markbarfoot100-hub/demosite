import { useEffect, useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Product } from '@/shared/types';
import ProductCard from '@/react-app/components/ProductCard';
import Header from '@/react-app/components/Header';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStrainType, setSelectedStrainType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['all', 'flower', 'edibles', 'concentrates', 'vapes', 'topicals', 'accessories'];
  const strainTypes = ['all', 'indica', 'sativa', 'hybrid'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Strain type filter
    if (selectedStrainType !== 'all') {
      filtered = filtered.filter(product => product.strain_type === selectedStrainType);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedStrainType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full cosmic-glow"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url(https://mocha-cdn.com/019a2ada-c91b-7c1b-9da0-94076d92107c/hero-psychedelic-cannabis.jpg)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black" />
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="font-cosmic-bold text-5xl md:text-6xl text-white mb-4 cosmic-text-glow">
            Our <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Products</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our premium collection of medical marijuana products
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gradient-to-b from-black to-purple-950/10">
        <div className="container mx-auto px-6">
          <div className="bg-cosmic-card rounded-2xl p-6 cosmic-glow">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-xl text-white transition-all cosmic-glow"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
              </button>

              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center space-x-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-black/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-black">
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStrainType}
                  onChange={(e) => setSelectedStrainType(e.target.value)}
                  className="bg-black/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                >
                  {strainTypes.map(type => (
                    <option key={type} value={type} className="bg-black">
                      {type === 'all' ? 'All Strains' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mt-4 pt-4 border-t border-purple-500/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-black/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  >
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-black">
                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedStrainType}
                    onChange={(e) => setSelectedStrainType(e.target.value)}
                    className="bg-black/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  >
                    {strainTypes.map(type => (
                      <option key={type} value={type} className="bg-black">
                        {type === 'all' ? 'All Strains' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="font-cosmic text-xl text-white mb-2">No products found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-cosmic text-2xl text-white">
                  {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
                </h2>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
