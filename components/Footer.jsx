import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-16 px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-12">
        <div>
          <h4 className="font-bold text-lg mb-4 text-white">Get to Know Us</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-4 text-white">Make Money with Us</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white">Sell products</a></li>
            <li><a href="#" className="hover:text-white">Advertise Your Products</a></li>
            <li><a href="#" className="hover:text-white">Self-Publish with Us</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-4 text-white">Let Us Help You</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/settings" className="hover:text-white">Your Account</Link></li>
            <li><Link to="/order-summary" className="hover:text-white">Your Orders</Link></li>
            <li><a href="#" className="hover:text-white">Returns & Replacements</a></li>
            <li><a href="#" className="hover:text-white">Manage Your Content and Devices</a></li>
            <li><a href="#" className="hover:text-white">Help</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-4 text-white">Contact Info</h4>
          <p className="text-sm text-gray-400 mb-2">Phone: +44 20 7946 0123</p>
          <p className="text-sm text-gray-400 mb-2">Email: support@hexa.com</p>
          <p className="text-sm text-gray-400">Address: 123 Northern Park Lane, West London, W4 4Z, United Kingdom</p>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
        <p>&copy; 2024 HEXA. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;