import { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ProductsPage() {
  const { products, filteredProducts, paginatedProducts, loading, error, pagination, page, nextPage, prevPage, filterProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [colorFilter, setColorFilter] = useState('all');
  const [minRating, setMinRating] = useState('');
  const [collapsedSections, setCollapsedSections] = useState({
    categories: false,
    brands: false,
    size: false,
    color: false
  });

  const categories = useMemo(() => {
    const raw = products.map(p => p.category || (p.category_id ? `Category ${p.category_id}` : 'Uncategorized'));
    return ['All', ...Array.from(new Set(raw))];
  }, [products]);

  const brands = useMemo(() => {
    const raw = products.map(p => p.name.split(' ')[0]);
    return ['All', ...Array.from(new Set(raw))];
  }, [products]);

  const currentProducts = Array.isArray(paginatedProducts) ? paginatedProducts : [];

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (newCategory = activeCategory, newSort = sortOption, newMin = minPrice, newMax = maxPrice, newSearch = searchTerm, newStock = stockFilter, newBrand = brandFilter, newSize = sizeFilter, newColor = colorFilter, newRating = minRating) => {
    filterProducts(newSearch, newCategory === 'All' ? '' : newCategory, newSort, newMin, newMax, newStock, newBrand, newSize, newColor, newRating);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      <div className="loading">Loading collection...</div>
    </div>
  );

  return (
    <>
      {/* Hero Section */}
      <section className="h-[400px] bg-gradient-to-br from-[#0f0f23] to-[#1a1a2e] flex items-center relative">
        <div className="max-w-[1200px] mx-auto px-6">
          <h1 className="text-[clamp(3rem,8vw,5rem)] font-extrabold bg-gradient-to-r from-[#d4af37] to-[#f4e27a] bg-clip-text text-transparent text-center leading-tight">
            Clothing Collection
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 min-h-[70vh]">
        
        {/* Sidebar Filters */}
        <aside className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a] h-fit sticky top-[120px]">
          
          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                handleFilterChange(activeCategory, sortOption, minPrice, maxPrice, value, stockFilter, brandFilter, sizeFilter, colorFilter, minRating);
              }}
              className="w-full px-4 py-3.5 border border-[#2a2a2a] rounded-xl bg-white/5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors"
            />
          </div>

          {/* Categories */}
          <div className="mb-8">
            <div 
              className="flex justify-between items-center cursor-pointer select-none mb-4 group"
              onClick={() => toggleSection('categories')}
            >
              <h3 className="font-semibold text-white group-hover:text-[#d4af37] transition-colors">Categories</h3>
              {collapsedSections.categories ? <ChevronDown size={16} className="text-gray-400 group-hover:text-[#d4af37]" /> : <ChevronUp size={16} className="text-gray-400 group-hover:text-[#d4af37]" />}
            </div>
            {!collapsedSections.categories && (
              <div className="flex flex-wrap gap-2 mt-3">
                {categories.map(category => (
                  <div
                    key={category}
                    onClick={() => {
                      setActiveCategory(category === 'All' ? '' : category);
                      handleFilterChange(category === 'All' ? '' : category, sortOption, minPrice, maxPrice, searchTerm, stockFilter, brandFilter, sizeFilter, colorFilter, minRating);
                    }}
                    className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-all ${
                      category === (activeCategory || 'All')
                        ? 'bg-[#d4af37] text-black'
                        : 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-black'
                    }`}
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Brands */}
          <div className="mb-8">
            <div 
              className="flex justify-between items-center cursor-pointer select-none mb-4 group"
              onClick={() => toggleSection('brands')}
            >
              <h3 className="font-semibold text-white group-hover:text-[#d4af37] transition-colors">Brands</h3>
              {collapsedSections.brands ? <ChevronDown size={16} className="text-gray-400 group-hover:text-[#d4af37]" /> : <ChevronUp size={16} className="text-gray-400 group-hover:text-[#d4af37]" />}
            </div>
            {!collapsedSections.brands && (
              <div className="flex flex-wrap gap-2 mt-3">
                {brands.map(brand => (
                  <div
                    key={brand}
                    onClick={() => {
                      setBrandFilter(brand === 'All' ? 'all' : brand.toLowerCase());
                      handleFilterChange(activeCategory, sortOption, minPrice, maxPrice, searchTerm, stockFilter, brand === 'All' ? 'all' : brand.toLowerCase(), sizeFilter, colorFilter, minRating);
                    }}
                    className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-all ${
                      brand === (brandFilter === 'all' ? 'All' : brandFilter === brand.toLowerCase() ? brand : '')
                        ? 'bg-[#d4af37] text-black'
                        : 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-black'
                    }`}
                  >
                    {brand}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="font-semibold text-white mb-4">Price range</h3>
            <div className="space-y-3">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  setMinPrice(value);
                  handleFilterChange(activeCategory, sortOption, value, maxPrice, searchTerm, stockFilter, brandFilter, sizeFilter, colorFilter, minRating);
                }}
                className="w-full px-4 py-3 rounded-xl border border-[#2a2a2a] bg-white/5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  setMaxPrice(value);
                  handleFilterChange(activeCategory, sortOption, minPrice, value, searchTerm, stockFilter, brandFilter, sizeFilter, colorFilter, minRating);
                }}
                className="w-full px-4 py-3 rounded-xl border border-[#2a2a2a] bg-white/5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>
          </div>

          {/* Availability */}
          <div className="mb-8">
            <h3 className="font-semibold text-white mb-4">Availability</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'in-stock', label: 'In Stock' },
                { value: 'out-of-stock', label: 'Out of Stock' }
              ].map(option => (
                <div
                  key={option.value}
                  onClick={() => {
                    setStockFilter(option.value);
                    handleFilterChange(activeCategory, sortOption, minPrice, maxPrice, searchTerm, option.value, brandFilter, sizeFilter, colorFilter, minRating);
                  }}
                  className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-all ${
                    stockFilter === option.value
                      ? 'bg-[#d4af37] text-black'
                      : 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-black'
                  }`}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-8">
            <div 
              className="flex justify-between items-center cursor-pointer select-none mb-4 group"
              onClick={() => toggleSection('size')}
            >
              <h3 className="font-semibold text-white group-hover:text-[#d4af37] transition-colors">Size</h3>
              {collapsedSections.size ? <ChevronDown size={16} className="text-gray-400 group-hover:text-[#d4af37]" /> : <ChevronUp size={16} className="text-gray-400 group-hover:text-[#d4af37]" />}
            </div>
            {!collapsedSections.size && (
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  { value: 'all', label: 'All Sizes' },
                  { value: 'xs', label: 'XS' },
                  { value: 's', label: 'S' },
                  { value: 'm', label: 'M' },
                  { value: 'l', label: 'L' },
                  { value: 'xl', label: 'XL' },
                  { value: 'xxl', label: 'XXL' }
                ].map(option => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setSizeFilter(option.value);
                      handleFilterChange(activeCategory, sortOption, minPrice, maxPrice, searchTerm, stockFilter, brandFilter, option.value, colorFilter, minRating);
                    }}
                    className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-all ${
                      sizeFilter === option.value
                        ? 'bg-[#d4af37] text-black'
                        : 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-black'
                    }`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Color */}
          <div className="mb-8">
            <div 
              className="flex justify-between items-center cursor-pointer select-none mb-4 group"
              onClick={() => toggleSection('color')}
            >
              <h3 className="font-semibold text-white group-hover:text-[#d4af37] transition-colors">Color</h3>
              {collapsedSections.color ? <ChevronDown size={16} className="text-gray-400 group-hover:text-[#d4af37]" /> : <ChevronUp size={16} className="text-gray-400 group-hover:text-[#d4af37]" />}
            </div>
            {!collapsedSections.color && (
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  { value: 'all', label: 'All Colors' },
                  { value: 'black', label: 'Black' },
                  { value: 'white', label: 'White' },
                  { value: 'red', label: 'Red' },
                  { value: 'blue', label: 'Blue' },
                  { value: 'green', label: 'Green' },
                  { value: 'yellow', label: 'Yellow' },
                  { value: 'purple', label: 'Purple' },
                  { value: 'gray', label: 'Gray' }
                ].map(option => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setColorFilter(option.value);
                      handleFilterChange(activeCategory, sortOption, minPrice, maxPrice, searchTerm, stockFilter, brandFilter, sizeFilter, option.value, minRating);
                    }}
                    className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-all ${
                      colorFilter === option.value
                        ? 'bg-[#d4af37] text-black'
                        : 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-black'
                    }`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Minimum Rating */}
          <div className="mb-8">
            <h3 className="font-semibold text-white mb-4">Minimum Rating</h3>
            <select
              value={minRating}
              onChange={(e) => {
                const value = e.target.value;
                setMinRating(value);
                handleFilterChange(activeCategory, sortOption, minPrice, maxPrice, searchTerm, stockFilter, brandFilter, sizeFilter, colorFilter, value);
              }}
              className="w-full px-4 py-3 rounded-xl border border-[#2a2a2a] bg-white/5 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
            >
              <option value="">Any Rating</option>
              <option value="1">1+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>

          {/* Sort by */}
          <div className="mb-8">
            <h3 className="font-semibold text-white mb-4">Sort by</h3>
            <select
              value={sortOption}
              onChange={(e) => {
                const value = e.target.value;
                setSortOption(value);
                handleFilterChange(activeCategory, value, minPrice, maxPrice, searchTerm, stockFilter, brandFilter, sizeFilter, colorFilter, minRating);
              }}
              className="w-full px-4 py-3 rounded-xl border border-[#2a2a2a] bg-white/5 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
            >
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating-high">Rating: High to Low</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('');
                setSortOption('name');
                setMinPrice('');
                setMaxPrice('');
                setStockFilter('all');
                setBrandFilter('all');
                setSizeFilter('all');
                setColorFilter('all');
                setMinRating('');
                filterProducts('', '', 'name', '', '', 'all', 'all', 'all', 'all', '');
              }}
              className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-transparent text-gray-400 font-semibold hover:border-[#2a2a2a] hover:bg-white/5 transition-all"
            >
              Clear filters
            </button>
          </div>
        </aside>

        {/* Products Grid */}
        <div>
          {error && (
            <div className="p-6 border border-white/12 bg-white/5 text-gray-400 rounded-xl mb-6">
              {error}. Please make sure the backend server is running at http://localhost:5001.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {!loading && currentProducts.length === 0 && !error && (
            <div className="p-6 border border-white/12 bg-white/5 text-gray-400 rounded-xl">
              No products available right now. If you have a local backend, please start it and refresh the page.
            </div>
          )}

          {pagination.total > 0 && (
            <div className="flex gap-2 justify-center items-center mt-16 flex-wrap">
              <button 
                onClick={prevPage} 
                disabled={!pagination.hasPrev}
                className="px-5 py-3 border border-[#2a2a2a] bg-[#121212] text-white rounded-lg cursor-pointer transition-all hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] disabled:opacity-50 disabled:cursor-not-allowed font-medium min-w-[48px] text-center"
              >
                Prev
              </button>

              <span className="min-w-[120px] text-center px-3 py-3 text-gray-400 text-sm">
                Page {page} of {pagination.pages} • Showing {currentProducts.length} of {pagination.total} products
              </span>

              <button 
                onClick={nextPage} 
                disabled={!pagination.hasNext}
                className="px-5 py-3 border border-[#2a2a2a] bg-[#121212] text-white rounded-lg cursor-pointer transition-all hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] disabled:opacity-50 disabled:cursor-not-allowed font-medium min-w-[48px] text-center"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}