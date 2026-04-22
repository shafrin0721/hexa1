export default function QuantitySelector({ quantity, setQuantity }) {
  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="quantity-selector-group">
      <label className="option-label">Quantity:</label>
      <div className="quantity-control">
        <button 
          className="quantity-btn"
          onClick={handleDecrease}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="quantity-display">{quantity}</span>
        <button 
          className="quantity-btn"
          onClick={handleIncrease}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
}