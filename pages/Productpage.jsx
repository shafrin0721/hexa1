import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import QuantitySelector from '../components/QuantitySelector';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { getProductById } from '../services/api';


export default function ProductPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { products, loading: productsLoading } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('S');
  const [quantity, setQuantity] = useState(1);

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const productId = Number(searchParams.get('id')) || 1;

  useEffect(() => {
   setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (products.length > 0) {
        const found = products.find(p => p.id === productId);
        if (found) {
          setProduct(found);
          setLoading(false);
          return;
        }
      }
      
      try {
        setLoading(true);
        const response = await getProductById(productId);
        setProduct(response.data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, products]);

  const related = useMemo(() => {
    if (!product || productsLoading) return [];
    return products.filter(p => p.id !== product.id).slice(0, 4);
  }, [product, products, productsLoading]);

  const addToCart = (item, qty = 1, size = 'S') => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: qty,
        variant: size,
      },
    });
  };

  // const handleAddToCart = () => {
  //   if (product) addToCart(product, quantity, selectedSize);
  // };

  // const handleBuyNow = () => {
  //   if (product) {
  //     addToCart(product, quantity, selectedSize);
  //     navigate('/order-summary');
  //   }
  // };

const handleAddToCart = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate('/auth'); 
    return;
  }

  // Token එක තියෙනවා නම් කෙලින්ම add කරනවා
  if (product) addToCart(product, quantity, selectedSize);
};

  const handleBuyNow = () => {
    const isAuthenticated = localStorage.getItem("token");

    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (product) {
      addToCart(product, quantity, selectedSize);
      navigate('/order-summary');
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] grid place-items-center text-gray-400">
      <div>Loading product...</div>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-[60vh] grid place-items-center text-red-500">
      <div>{error || 'Product not found'}</div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6">
      {/* Product Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 py-16 items-center">
        {/* Product Image */}
        <div>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full max-w-[520px] rounded-2xl object-cover shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
            {product.name}
          </h1>
          
          <p className="text-gray-400 max-w-md leading-relaxed">
            {product.description}
          </p>
          
          <div className="text-3xl font-bold text-[#d4af37] my-1">
            ${Number(product.price).toFixed(2)}
          </div>
          
          {/* Size Selection */}
          <div className="mb-2">
            <label className="block font-semibold text-white text-sm mb-2">
              Size:
            </label>
            <select 
              value={selectedSize} 
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full max-w-[200px] px-4 py-2.5 border border-[#2a2a2a] rounded-lg bg-white/5 text-white text-sm font-medium cursor-pointer transition-all hover:border-[#d4af37] hover:bg-white/10 focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
            >
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </div>

          {/* Quantity Selector */}
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-1">
            <button 
              className="flex-1 h-12 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] text-white font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:opacity-95"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button 
              className="flex-1 h-12 rounded-xl bg-[#d4af37] text-black font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:opacity-95"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-32">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-11">
            Related Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}