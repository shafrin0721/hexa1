const orderMock = {
  id: "ORD001",
  items: [
    {
      name: "Product 1",
      price: 2000,
      quantity: 1,
      image: "https://via.placeholder.com/100"
    }
  ],
  shipping: 300,
  total: 2300,
  user: {
    name: "Customer Name",
    address: "Colombo"
  }
};

export default orderMock;