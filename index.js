const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

let taxRate = 5;
let discountPercentage = 10;
let loyalRate = 2;

function totalPrice(newItemPrice, cartTotal) {
  let result = newItemPrice + cartTotal;
  return result;
}
app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(totalPrice(newItemPrice, cartTotal).toString());
});

function calculateFinalPrice(cartTotal, isMember) {
  if (isMember) {
    return cartTotal * (1 - discountPercentage / 100);
  } else {
    return cartTotal;
  }
}
app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember === 'true';
  let finalPrice = calculateFinalPrice(cartTotal, isMember);
  res.send(finalPrice.toString());
});

function calculateTax(cartTotal) {
  return cartTotal * (taxRate / 100);
}
app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let tax = calculateTax(cartTotal);
  res.send(tax.toString());
});

function calculateDeliveryDays(shippingMethod, distance) {
  let deliveryDays;
  if (shippingMethod === 'standard') {
    deliveryDays = distance / 50;
  } else if (shippingMethod === 'express') {
    deliveryDays = distance / 100;
  } else {
    deliveryDays = null;
  }
  return deliveryDays;
}

app.get('/estimate-delivery', (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let distance = parseFloat(req.query.distance);
  let deliveryDays = calculateDeliveryDays(shippingMethod, distance);
  if (deliveryDays !== null) {
    res.send(deliveryDays.toString());
  } else {
    res.send('Invalid shipping method');
  }
});

function calculateShipping(weight, distance) {
  return weight * distance * 0.1;
}
app.get('/shipping-cost', (req, res) => {
  let weight = parseFloat(req.query.weight);
  let distance = parseFloat(req.query.distance);
  res.send(calculateShipping(weight, distance).toString());
});

function calculateLoyaltyPoints(purchaseAmount) {
  return purchaseAmount * 2; 
}
app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);let loyaltyPoints = calculateLoyaltyPoints(purchaseAmount);res.send(loyaltyPoints.toString());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
