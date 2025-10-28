import { useEffect, useState } from 'react';
import { Plus, LogOut } from 'lucide-react';
import { Product, CreateProduct, UpdateProduct } from '@/shared/types';
import { useAuth } from '@/react-app/hooks/useAuth';
import Header from '@/react-app/components/Header';
import ProductCard from '@/react-app/components/ProductCard';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: "flower" | "edibles" | "concentrates" | "vapes" | "topicals" | "accessories";
  strain_type: string;
  thc_percentage: string;
  cbd_percentage: string;
  image_url: string;
  stock_quantity: string;
}

export default function Admin() {
  const { logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: 'flower',
    strain_type: '',
    thc_percentage: '',
    cbd_percentage: '',
    image_url: '',
    stock_quantity: '',
  });

  const categories: Array<"flower" | "edibles" | "concentrates" | "vapes" | "topicals" | "accessories"> = ['flower', 'edibles', 'concentrates', 'vapes', 'topicals', 'accessories'];
  const strainTypes: Array<'' | 'indica' | 'sativa' | 'hybrid'> = ['', 'indica', 'sativa', 'hybrid'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Ensure price is a valid positive number
      const price = Number(formData.price);
      if (isNaN(price) || price <= 0) {
        alert('Please enter a valid price greater than 0');
        return;
      }

      // Ensure stock quantity is a valid non-negative number
      const stockQuantity = Number(formData.stock_quantity);
      if (isNaN(stockQuantity) || stockQuantity < 0) {
        alert('Please enter a valid stock quantity (0 or greater)');
        return;
      }

      // Parse percentage values
      const thcPercentage = formData.thc_percentage ? Number(formData.thc_percentage) : 0;
      const cbdPercentage = formData.cbd_percentage ? Number(formData.cbd_percentage) : 0;

      const payload: CreateProduct | UpdateProduct = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: price,
        category: formData.category,
        stock_quantity: stockQuantity,
        thc_percentage: thcPercentage > 0 ? thcPercentage : undefined,
        cbd_percentage: cbdPercentage > 0 ? cbdPercentage : undefined,
        strain_type: formData.strain_type ? (formData.strain_type as 'indica' | 'sativa' | 'hybrid') : undefined,
        image_url: formData.image_url.trim() || undefined,
      };

      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save product');
      }

      const result = await response.json();
      console.log('Product saved successfully:', result);
      
      await fetchProducts();
      resetForm();
      alert(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Failed to save product: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category as "flower" | "edibles" | "concentrates" | "vapes" | "topicals" | "accessories",
      strain_type: product.strain_type || '' as string,
      thc_percentage: product.thc_percentage ? product.thc_percentage.toString() : '',
      cbd_percentage: product.cbd_percentage ? product.cbd_percentage.toString() : '',
      image_url: product.image_url || '',
      stock_quantity: product.stock_quantity.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/products/${id}/toggle`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle product');
      }

      await fetchProducts();
    } catch (error) {
      console.error('Error toggling product:', error);
      alert('Failed to toggle product');
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setShowForm(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'flower',
      strain_type: '',
      thc_percentage: '',
      cbd_percentage: '',
      image_url: '',
      stock_quantity: '',
    });
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

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-purple-600 px-6 py-3 rounded-xl text-white hover:from-green-700 hover:to-purple-700 transition-all cosmic-glow-green"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-red-600 px-6 py-3 rounded-xl text-white hover:bg-red-700 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-cosmic-bold text-4xl text-white cosmic-text-glow mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">Manage your cannabis product inventory</p>
          </div>

          {/* Product Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-cosmic-card rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto cosmic-glow">
                <h2 className="font-cosmic text-2xl text-white mb-6">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Category *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value as "flower" | "edibles" | "concentrates" | "vapes" | "topicals" | "accessories"})}
                        className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      >
                        {categories.map(category => (
                          <option key={category} value={category} className="bg-black">
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Strain Type
                      </label>
                      <select
                        value={formData.strain_type}
                        onChange={(e) => setFormData({...formData, strain_type: e.target.value})}
                        className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      >
                        {strainTypes.map(type => (
                          <option key={type} value={type} className="bg-black">
                            {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'None'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                        className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        THC %
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={formData.thc_percentage}
                        onChange={(e) => setFormData({...formData, thc_percentage: e.target.value})}
                        className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                        placeholder="0.0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        CBD %
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={formData.cbd_percentage}
                        onChange={(e) => setFormData({...formData, cbd_percentage: e.target.value})}
                        className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                        placeholder="0.0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-600 to-purple-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-purple-700 transition-all cosmic-glow font-medium"
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-8 bg-gray-600 text-white py-3 rounded-xl hover:bg-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isAdmin={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="font-cosmic text-xl text-white mb-2">No products yet</h3>
              <p className="text-gray-400 mb-6">Add your first product to get started</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-green-600 to-purple-600 px-6 py-3 rounded-xl text-white hover:from-green-700 hover:to-purple-700 transition-all cosmic-glow-green"
              >
                Add Your First Product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
