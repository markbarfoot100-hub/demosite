import { Link } from 'react-router';
import { Leaf, Zap, Heart } from 'lucide-react';
import { Product } from '@/shared/types';

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
  onToggle?: (id: number) => void;
}

export default function ProductCard({ 
  product, 
  isAdmin = false, 
  onEdit, 
  onDelete, 
  onToggle 
}: ProductCardProps) {
  const getStrainIcon = (strainType: string | null) => {
    switch (strainType) {
      case 'indica': return <Heart className="w-4 h-4 text-purple-400" />;
      case 'sativa': return <Zap className="w-4 h-4 text-green-400" />;
      case 'hybrid': return <Leaf className="w-4 h-4 text-pink-400" />;
      default: return null;
    }
  };

  const getStrainColor = (strainType: string | null) => {
    switch (strainType) {
      case 'indica': return 'text-purple-400 bg-purple-500/20';
      case 'sativa': return 'text-green-400 bg-green-500/20';
      case 'hybrid': return 'text-pink-400 bg-pink-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className={`bg-cosmic-card rounded-2xl overflow-hidden cosmic-glow hover:cosmic-glow-green transition-all duration-300 float-animation group ${!product.is_available && isAdmin ? 'opacity-60 grayscale' : ''}`}>
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: product.image_url 
              ? `url(${product.image_url})` 
              : 'url(https://mocha-cdn.com/019a2ada-c91b-7c1b-9da0-94076d92107c/product-bg-psychedelic.jpg)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Availability Badge */}
        {!product.is_available && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-red-500/80 backdrop-blur-sm rounded-full text-white text-xs font-medium">
            {isAdmin ? 'Hidden' : 'Out of Stock'}
          </div>
        )}
        
        {/* Admin Controls */}
        {isAdmin && (
          <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit?.(product)}
              className="px-3 py-1 bg-blue-500/80 backdrop-blur-sm rounded-full text-white text-xs font-medium hover:bg-blue-600/80"
            >
              Edit
            </button>
            <button
              onClick={() => onToggle?.(product.id)}
              className="px-3 py-1 bg-yellow-500/80 backdrop-blur-sm rounded-full text-white text-xs font-medium hover:bg-yellow-600/80"
            >
              {product.is_available ? 'Hide' : 'Show'}
            </button>
            <button
              onClick={() => onDelete?.(product.id)}
              className="px-3 py-1 bg-red-500/80 backdrop-blur-sm rounded-full text-white text-xs font-medium hover:bg-red-600/80"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-cosmic text-lg text-white group-hover:cosmic-text-glow transition-all">
            {product.name}
          </h3>
          <span className="font-cosmic text-green-400 text-xl">
            ${product.price}
          </span>
        </div>

        {product.description && (
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          {/* Strain Type & Potency */}
          <div className="flex items-center space-x-3">
            {product.strain_type && (
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStrainColor(product.strain_type)}`}>
                {getStrainIcon(product.strain_type)}
                <span className="capitalize">{product.strain_type}</span>
              </div>
            )}
            
            {product.thc_percentage && (
              <div className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium">
                {product.thc_percentage}% THC
              </div>
            )}
          </div>

          {/* Category */}
          <div className="text-xs text-gray-400 capitalize">
            {product.category}
          </div>
        </div>

        {/* View Details Button */}
        <Link
          to={`/products/${product.id}`}
          className="block w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all cosmic-glow"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
