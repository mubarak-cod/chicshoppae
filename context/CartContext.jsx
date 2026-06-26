"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();
const STORAGE_KEY = "chic-shoppae-cart";

function getColorKey(color) {
  if (!color) return "";
  return String(color).toLowerCase();
}

function normalizeProductColor(product, color) {
  if (!product?.colors?.length) return null;
  if (!color) return product.colors[0];

  const match = product.colors.find((option) => getColorKey(option) === getColorKey(color));
  return match || product.colors[0];
}

function isSameVariant(item, id, selectedColor, selectedSize) {
  return (
    item.id === id &&
    getColorKey(item.selectedColor) === getColorKey(selectedColor) &&
    (item.selectedSize || "") === (selectedSize || "")
  );
}

function normalizeColor(product, color) {
  return normalizeProductColor(product, color);
}

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
    const selectedColor = normalizeColor(product, options.selectedColor);
    const payload = {
      ...product,
      selectedColor,
      selectedSize: options.selectedSize || product.sizes?.[0] || product.styles?.[0] || null,
      quantity: options.quantity || 1,
    };

    setCartItems((prev) => {
      const exists = prev.find(
        (item) => isSameVariant(item, payload.id, payload.selectedColor, payload.selectedSize)
      );

      if (exists) {
        return prev.map((item) =>
          isSameVariant(item, payload.id, payload.selectedColor, payload.selectedSize)
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
        (item) => !isSameVariant(item, id, selectedColor, selectedSize)
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
        isSameVariant(item, id, selectedColor, selectedSize)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const updateCartItemColor = (id, selectedSize, currentColor, nextColor) => {
    setCartItems((prev) => {
      const currentIndex = prev.findIndex((item) => isSameVariant(item, id, currentColor, selectedSize));
      if (currentIndex === -1) return prev;

      const sourceProduct = prev[currentIndex];
      const normalizedNextColor = normalizeProductColor(sourceProduct, nextColor) || nextColor;
      const targetIndex = prev.findIndex((item) => isSameVariant(item, id, normalizedNextColor, selectedSize));

      const nextItems = [...prev];

      if (targetIndex !== -1 && targetIndex !== currentIndex) {
        nextItems[targetIndex] = {
          ...nextItems[targetIndex],
          quantity: nextItems[targetIndex].quantity + nextItems[currentIndex].quantity,
        };
        nextItems.splice(currentIndex, 1);
        return nextItems;
      }

      nextItems[currentIndex] = {
        ...nextItems[currentIndex],
        selectedColor: normalizedNextColor,
      };

      return nextItems;
    });
  };

  const clearCart = () => setCartItems([]);

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0
    );
    return {
      subtotal,
      shipping: subtotal > 50000 || subtotal === 0 ? 0 : 100,
      discount: 0,
      total: subtotal > 0 ? subtotal + (subtotal > 50000 ? 0 : 100) : 0,
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
        updateCartItemColor,
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