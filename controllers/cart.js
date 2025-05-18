import Cart from "../model/Cart.js";
import mongoose from "mongoose";
//add to cart
export const addToCart = async (req, res) => {
  const { userId, productId } = req.body;
  //validate fields
  if (!userId || !productId) {
    return res.status(400).json({ message: "All fields required" });
  }
  try {
    if (
      !mongoose.isValidObjectId(userId) ||
      !mongoose.isValidObjectId(productId)
    ) {
      return res.status(400).json({ message: "Invalid user or product ID" });
    }
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      //create a new cart items
      cart = await Cart.create({
        user: userId,
        items: [],
      });
    }
    //check if item exits in cart
    //if not add item to existing
    const cartExt = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (cartExt) {
      cartExt.quantity++;
    } else {
      cart.items.push({ product: productId });
    }
    await cart.save();
    return res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.log("add to cart error", error.message);
    return res.status(500).json({ message: "an unknown error occurred" });
  }
};
// update cart
export const updateCart = async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;
  //validate fields
  if (!productId || !quantity) {
    return res.status(400).json({ message: "All fields required" });
  }
  try {
    //find user cart
    const userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
      return res.status(400).json({ message: "Cart not found" });
    }
    //get cart item index
    const index = userCart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (index === -1) {
      return res.status(400).json({ message: "cart is empty" });
    }
    //update quantity
    if (quantity > 0) {
      userCart.items[index].quantity += quantity;
    } else {
      userCart.items.splice(index, 1);
    }
    await userCart.save();
    return res.status(200).json({ message: "cart quantity updated" });
  } catch (error) {
    console.log("Error updating cart items", error.message);
    return res.status(400).json({ message: "an unknown error occurred" });
  }
};

//delete cartItems
export const deleteCartItem = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;
  //validate fields
  if (!userId || !productId) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    //find user cart
    const userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
      return res.status(400).json({ message: "Cart not found" });
    }
    //find product match
    const index = userCart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (index === -1) {
      return res.status(400).json({ message: "cart is empty" });
    }
    //remove cartItem adn save
    userCart.items.splice(index, 1);
    await userCart.save();
  } catch (error) {
    console.log("Error deleting cartItem", error.message);
    return res.status(400).json({ message: "an unknown error occurred" });
  }
};

//empty cart
export const emptyCart = async (req, res) => {
  const { userId } = req.params;
  //validate fields
  if (!userId) {
    return res.status(400).json({ message: "All fields required" });
  }
  try {
    //get cart by userid
    const userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
      return res.status(400).json({ message: "Cart not found" });
    }

    //empty cart
    userCart.items = [];
    await userCart.save();
  } catch (error) {
    console.log("Error emptying cart", error.message);
    return res.status(400).json({ message: "an unknown error occurred" });
  }
};
