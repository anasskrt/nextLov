"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

interface CartItem {
  productId: string;
  quantity: number;
}

// Sample cart items - in a real app these would come from state management
const initialCartItems: CartItem[] = [
  { productId: "1", quantity: 1 },
  { productId: "3", quantity: 2 },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const cartProducts = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return { ...item, product };
  });

  const subtotal = cartProducts.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex text-sm mb-8">
          <Link href="/" className="text-gray-500 hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400 self-center" />
          <span className="text-gray-800 font-medium">Shopping Cart</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-serif mb-8">Your Cart</h1>

        {cartItems.length > 0 ? (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                {/* Cart Header */}
                <div className="bg-gray-50 p-4 md:p-6 border-b">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">
                      {cartItems.length}{" "}
                      {cartItems.length === 1 ? "Item" : "Items"}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-primary text-sm"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>

                {/* Cart Items */}
                <div>
                  {cartProducts.map(
                    (item) =>
                      item.product && (
                        <div
                          key={item.productId}
                          className="p-4 md:p-6 border-b last:border-b-0"
                        >
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <Link
                              href={`/product/${item.productId}`}
                              className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 relative"
                            >
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                fill
                                className="object-cover rounded-md"
                                unoptimized
                              />
                            </Link>

                            {/* Product Info */}
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <Link
                                    href={`/product/${item.productId}`}
                                    className="font-medium hover:text-primary transition-colors"
                                  >
                                    {item.product.name}
                                  </Link>
                                  <div className="text-sm text-gray-500">
                                    {item.product.brand}
                                  </div>
                                </div>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-gray-400 hover:text-gray-600"
                                  onClick={() => removeItem(item.productId)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="mt-4 flex justify-between items-center">
                                <div className="flex items-center border rounded-md">
                                  <button
                                    className="px-2 py-1 text-gray-500 hover:bg-gray-50"
                                    onClick={() =>
                                      updateQuantity(
                                        item.productId,
                                        item.quantity - 1
                                      )
                                    }
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="px-3 py-1 w-8 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    className="px-2 py-1 text-gray-500 hover:bg-gray-50"
                                    onClick={() =>
                                      updateQuantity(
                                        item.productId,
                                        item.quantity + 1
                                      )
                                    }
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>

                                <div className="font-medium">
                                  $
                                  {(
                                    item.product.price * item.quantity
                                  ).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mb-8 lg:mb-0">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-medium mb-4">Order Summary</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>

                    {subtotal < 50 && (
                      <div className="text-xs text-gray-500 pt-1">
                        Add ${(50 - subtotal).toFixed(2)} more for free shipping
                      </div>
                    )}

                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <Button asChild className="w-full">
                    <Link
                      href="/checkout"
                      className="flex items-center justify-center gap-2"
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  <div className="mt-6">
                    <h3 className="font-medium text-sm mb-3">We Accept</h3>
                    <div className="flex gap-2">
                      <div className="w-10 h-6 bg-gray-200 rounded" />
                      <div className="w-10 h-6 bg-gray-200 rounded" />
                      <div className="w-10 h-6 bg-gray-200 rounded" />
                      <div className="w-10 h-6 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button asChild>
              <Link href="/">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
