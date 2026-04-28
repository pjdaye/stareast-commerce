const { products } = require('../models/productsModel');

function checkoutItems(items, paymentMethod) {
  const acceptedMethods = ['cash', 'credit_card'];
  if (!acceptedMethods.includes(paymentMethod)) {
    throw new Error('Payment method must be cash or credit_card');
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Items must be a non-empty array');
  }

  let subtotal = 0;
  const details = items.map((item) => {
    const product = products.find((productItem) => productItem.id === item.productId);
    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    if (!item.quantity || item.quantity <= 0) {
      throw new Error(`Invalid quantity for product ${item.productId}`);
    }

    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;

    return {
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity: item.quantity,
      lineTotal,
    };
  });

  const discount = paymentMethod === 'cash' ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  return {
    paymentMethod,
    items: details,
    subtotal,
    discount,
    total,
  };
}

module.exports = { checkoutItems };
