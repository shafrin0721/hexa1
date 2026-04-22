import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(9);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/products');
      const data = response.data.products || response.data || [];
      setProducts(Array.isArray(data) ? data : []);
      setFilteredProducts(Array.isArray(data) ? data : []);
      setPage(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

    const filterProducts = useCallback((search = '', category = '', sort = 'name', minPrice = '', maxPrice = '', stockFilter = 'all', brandFilter = 'all', sizeFilter = 'all', colorFilter = 'all', minRating = '') => {
      let result = [...products];

      // Search
      if (search) {
        result = result.filter(p => 
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Category filter
      if (category) {
        result = result.filter(p => {
          const categoryLabel = p.category || (p.category_id ? `Category ${p.category_id}` : 'Uncategorized');
          return categoryLabel === category;
        });
      }

      // Brand filter
      if (brandFilter !== 'all') {
        result = result.filter(p => {
          const brand = p.name.split(' ')[0]; // Simple brand extraction from first word
          return brand.toLowerCase() === brandFilter.toLowerCase();
        });
      }

      // Size filter
      if (sizeFilter !== 'all') {
        result = result.filter(p => {
          if (!p.variants || !Array.isArray(p.variants)) return false;
          return p.variants.some(v => v.size === sizeFilter);
        });
      }

      // Color filter
      if (colorFilter !== 'all') {
        result = result.filter(p => {
          if (!p.variants || !Array.isArray(p.variants)) return false;
          return p.variants.some(v => v.color === colorFilter);
        });
      }

      // Rating filter
      if (minRating !== '') {
        result = result.filter(p => Number(p.avg_rating) >= Number(minRating));
      }

      // Price filters
      if (minPrice !== '') {
        result = result.filter(p => Number(p.price) >= Number(minPrice));
      }
      if (maxPrice !== '') {
        result = result.filter(p => Number(p.price) <= Number(maxPrice));
      }

      // Stock filter
      if (stockFilter === 'in-stock') {
        result = result.filter(p => (p.stock || 0) > 0);
      } else if (stockFilter === 'out-of-stock') {
        result = result.filter(p => (p.stock || 0) === 0);
      }

      // Sort
      switch (sort) {
        case 'price-low':
          result.sort((a, b) => Number(a.price) - Number(b.price));
          break;
        case 'price-high':
          result.sort((a, b) => Number(b.price) - Number(a.price));
          break;
        case 'rating-high':
          result.sort((a, b) => Number(b.avg_rating) - Number(a.avg_rating));
          break;
        case 'name':
        default:
          result.sort((a, b) => a.name.localeCompare(b.name));
      }

      setFilteredProducts(result);
      setPage(1);
    }, [products]);

  const total = filteredProducts.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pages);
  const pagination = {
    total,
    pages,
    hasPrev: safePage > 1,
    hasNext: safePage < pages
  };

  useEffect(() => {
    if (page > pages) {
      setPage(pages);
    }
  }, [page, pages]);

  const paginatedProducts = Array.isArray(filteredProducts)
    ? filteredProducts.slice((safePage - 1) * limit, safePage * limit)
    : [];

  return (
    <ProductContext.Provider value={{
      products,
      filteredProducts,
      paginatedProducts,
      loading,
      error,
      pagination,
      page: safePage,
      setPage,
      refetch: () => fetchProducts(1),
      filterProducts,
      nextPage: () => setPage(p => Math.min(pages, p + 1)),
      prevPage: () => setPage(p => Math.max(1, p - 1))
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};
