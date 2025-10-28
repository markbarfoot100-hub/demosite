import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Leaf, Zap, Heart, Package, AlertTriangle } from 'lucide-react';
import { Product } from '@/shared/types';
import Header from '@/react-app/components/Header';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Product not found');
        }
        
        setProduct(data.product);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getStrainIcon = (strainType: string | null) => {
    switch (strainType) {
      case 'indica': return <Heart className="w-6 h-6 text-purple-400" />;
      case 'sativa': return <Zap className="w-6 h-6 text-green-400" />;
      case 'hybrid': return <Leaf className="w-6 h-6 text-pink-400" />;
      default: return null;
    }
  };

  const getStrainInfo = (strainType: string | null) => {
    switch (strainType) {
      case 'indica':
        return {
          name: 'Indica',
          description: 'Known for relaxing and sedating effects, perfect for evening use.',
          color: 'from-purple-600 to-purple-800'
        };
      case 'sativa':
        return {
          name: 'Sativa',
          description: 'Energizing and uplifting effects, great for daytime use.',
          color: 'from-green-600 to-green-800'
        };
      case 'hybrid':
        return {
          name: 'Hybrid',
          description: 'Balanced effects combining the best of both indica and sativa.',
          color: 'from-pink-600 to-pink-800'
        };
      default:
        return null;
    }
  };

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

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="font-cosmic text-2xl text-white mb-2">Product Not Found</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl text-white hover:from-purple-700 hover:to-pink-700 transition-all cosmic-glow"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Products</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const strainInfo = getStrainInfo(product.strain_type);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Products</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden cosmic-glow">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: product.image_url 
                      ? `url(${product.image_url})` 
                      : 'url(https://mocha-cdn.com/019a2ada-c91b-7c1b-9da0-94076d92107c/product-bg-psychedelic.jpg)'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {!product.is_available && (
                  <div className="absolute top-4 left-4 px-4 py-2 bg-red-500/80 backdrop-blur-sm rounded-full text-white font-medium">
                    Out of Stock
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h1 className="font-cosmic-bold text-4xl text-white cosmic-text-glow">
                    {product.name}
                  </h1>
                  <div className="text-right">
                    <div className="font-cosmic text-3xl text-green-400">
                      ${product.price}
                    </div>
                    <div className="text-sm text-gray-400 capitalize">
                      {product.category}
                    </div>
                  </div>
                </div>

                {product.description && (
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Strain Info */}
              {strainInfo && (
                <div className={`bg-gradient-to-r ${strainInfo.color} rounded-2xl p-6 cosmic-glow`}>
                  <div className="flex items-center space-x-3 mb-3">
                    {getStrainIcon(product.strain_type)}
                    <h3 className="font-cosmic text-xl text-white">
                      {strainInfo.name} Strain
                    </h3>
                  </div>
                  <p className="text-white/90">
                    {strainInfo.description}
                  </p>
                </div>
              )}

              {/* Potency Info */}
              {(product.thc_percentage || product.cbd_percentage) && (
                <div className="grid grid-cols-2 gap-4">
                  {product.thc_percentage && (
                    <div className="bg-cosmic-card rounded-xl p-4 text-center cosmic-glow">
                      <div className="text-2xl font-cosmic text-orange-400 mb-1">
                        {product.thc_percentage}%
                      </div>
                      <div className="text-sm text-gray-400">THC</div>
                    </div>
                  )}
                  {product.cbd_percentage && (
                    <div className="bg-cosmic-card rounded-xl p-4 text-center cosmic-glow">
                      <div className="text-2xl font-cosmic text-green-400 mb-1">
                        {product.cbd_percentage}%
                      </div>
                      <div className="text-sm text-gray-400">CBD</div>
                    </div>
                  )}
                </div>
              )}

              {/* Stock Info */}
              <div className="bg-cosmic-card rounded-xl p-4 cosmic-glow">
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">
                      {product.is_available ? 'In Stock' : 'Out of Stock'}
                    </div>
                    <div className="text-sm text-gray-400">
                      {product.stock_quantity} units available
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Disclaimer */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-yellow-400 font-medium mb-1">Medical Use Only</h4>
                    <p className="text-sm text-yellow-200/80">
                      This product is for medical marijuana patients only. Must be 21+ with valid medical marijuana card. 
                      Please consume responsibly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact for Purchase */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-center cosmic-glow">
                <h3 className="font-cosmic text-xl text-white mb-2">Ready to Purchase?</h3>
                <p className="text-white/90 mb-4">
                  Contact our dispensary to check availability and place your order.
                </p>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl text-white font-medium transition-all">
                  Contact Dispensary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
