"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();
const STORAGE_KEY = "chic-shoppae-cart";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedCart = window.localStorage.getItem(STORAGE_KEY);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch {
      // Ignore malformed storage and fall back to an empty cart.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, hydrated]);

  const addToCart = (product, options = {}) => {
    const payload = {
      ...product,
      selectedColor: options.selectedColor || product.colors?.[0] || null,
      selectedSize: options.selectedSize || product.sizes?.[0] || null,
      quantity: options.quantity || 1,
    };

    setCartItems((prev) => {
      const exists = prev.find(
        (item) =>
          item.id === payload.id &&
          item.selectedColor === payload.selectedColor &&
          item.selectedSize === payload.selectedSize
      );

      if (exists) {
        return prev.map((item) =>
          item.id === payload.id &&
          item.selectedColor === payload.selectedColor &&
          item.selectedSize === payload.selectedSize
            ? { ...item, quantity: item.quantity + payload.quantity }
            : item
        );
      }

      return [...prev, payload];
    });
  };

  const removeFromCart = (id, selectedColor, selectedSize) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          )
      )
    );
  };

  const updateQuantity = (id, quantity, selectedColor, selectedSize) => {
    if (quantity < 1) {
      removeFromCart(id, selectedColor, selectedSize);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0
    );
    return {
      subtotal,
      shipping: subtotal > 50000 || subtotal === 0 ? 0 : 3500,
      discount: 0,
      total: subtotal > 0 ? subtotal + (subtotal > 50000 ? 0 : 3500) : 0,
    };
  }, [cartItems]);

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        ...totals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}