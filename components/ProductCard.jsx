import { useNavigate } from 'react-router-dom';

// Array of available Design folder images
const designImages = [
  '/images/Design/pexels-asif-hussain-139434523-13983318.jpg',
  '/images/Design/pexels-bandar-baant-2160637741-36899307.jpg',
  '/images/Design/pexels-bandar-baant-2160637741-36908562.jpg',
  '/images/Design/pexels-bandar-baant-2160637741-36908564.jpg',
  '/images/Design/pexels-bandar-baant-2160637741-36908588.jpg',
  '/images/Design/pexels-bandar-baant-2160637741-37025819.jpg',
  '/images/Design/pexels-bandar-baant-2160637741-37026122.jpg',
  '/images/Design/pexels-bandar-baant-2160637741-37066757.jpg',
  '/images/Design/pexels-bandar-baant-2160637741-37092621.jpg',
  '/images/Design/pexels-ben-khatry-430197437-15943977.jpg',
  '/images/Design/pexels-edmilson-eucleni-64454054-11782729.jpg',
  '/images/Design/pexels-eliasdecarvalho-1007021.jpg',
  '/images/Design/pexels-mart-production-9558766.jpg',
  '/images/Design/pexels-oficialwallace-16526622.jpg',
  '/images/Design/pexels-palace-17400414.jpg',
  '/images/Design/pexels-rehman-alee-2153074881-32597798.jpg'
];

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/product?id=${product.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Use product ID to consistently assign the same image to the same product
  const getImageForProduct = (productId) => {
    const index = productId % designImages.length;
    return designImages[index];
  };

  const productImage = getImageForProduct(product.id);

  return (
    <div className="product-card" onClick={handleOpen}>
      <img src={productImage} alt={product.name} className="product-card-image" />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="stars">★★★★★</div>
      <div className="card-price">${Number(product.price).toFixed(2)}</div>
    </div>
  );
}