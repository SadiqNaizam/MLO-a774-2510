import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Typography } from '@/components/common/Typography';
import { ShoppingCart, Trash2, PlusCircle, MinusCircle, AlertTriangle, Tag } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

type CartItem = {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

const CartPage = () => {
  console.log('CartPage loaded');
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize cart items from location state or default to empty array
  const initialCartItems: CartItem[] = location.state?.cartItems || [
    // Fallback placeholder if no state is passed (e.g. direct navigation)
    { id: 'p1', name: 'Margherita Pizza', price: 12.99, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80' },
    { id: 'a1', name: 'Garlic Bread', price: 5.99, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1627308594192-7f01deb58333?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80' },
  ];
  const restaurantNameFromState: string = location.state?.restaurantName || "Selected Restaurant";

  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const updateQuantity = (id: string | number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      setCartItems(items => items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    }
  };

  const removeItem = (id: string | number) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast({ title: "Item removed from cart.", variant: "default" });
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(0.10); // 10% discount
      toast({ title: "Promo code applied!", description: "You get 10% off." });
    } else {
      setDiscount(0);
      toast({ title: "Invalid promo code.", variant: "destructive" });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiscount = subtotal * discount;
  const finalTotal = subtotal - totalDiscount;

  useEffect(() => {
    // Persist cart to localStorage or send to backend if needed
    console.log("Cart updated:", cartItems);
  }, [cartItems]);
  
  if (cartItems.length === 0 && !location.state?.cartItems) {
     // if cart is truly empty and not just waiting for state
      if (cartItems.length === 0) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
            <NavigationMenu />
            <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center">
                <ShoppingCart className="w-24 h-24 text-gray-300 mb-6" />
                <Typography variant="h3" as="h1" className="mb-3 text-gray-700">Your Cart is Empty</Typography>
                <Typography variant="body1" className="text-gray-500 mb-6 text-center">
                Looks like you haven't added anything to your cart yet.
                </Typography>
                <Button onClick={() => navigate('/')} className="bg-orange-500 hover:bg-orange-600">
                Start Shopping
                </Button>
            </main>
             <footer className="bg-gray-800 text-white text-center p-6 mt-auto">
                <Typography variant="body2">&copy; {new Date().getFullYear()} FoodDash. All rights reserved.</Typography>
            </footer>
            </div>
        );
      }
  }


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Typography variant="h2" as="h1" className="mb-2 text-gray-800">Your Shopping Cart</Typography>
        <Typography variant="subtitle1" as="p" className="mb-8 text-gray-600">
          Review items from <span className="font-semibold text-orange-600">{restaurantNameFromState}</span>.
        </Typography>

        {cartItems.length === 0 ? (
          <Alert variant="default" className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Your cart is empty!</AlertTitle>
            <AlertDescription>
              Add some delicious items from restaurants to get started.
              <Button variant="link" onClick={() => navigate('/')} className="p-0 h-auto ml-1 text-orange-600">Browse Restaurants</Button>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Item</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead className="text-center">Quantity</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cartItems.map(item => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <img src={item.imageUrl || 'https://via.placeholder.com/50'} alt={item.name} className="w-16 h-16 object-cover rounded" />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body1" className="font-medium">{item.name}</Typography>
                              <Typography variant="caption" className="text-gray-500">${item.price.toFixed(2)} each</Typography>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                  <MinusCircle className="h-4 w-4" />
                                </Button>
                                <span>{item.quantity}</span>
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                  <PlusCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-medium">${(item.price * item.quantity).toFixed(2)}</TableCell>
                            <TableCell className="text-center">
                              <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <Typography variant="body1">Subtotal:</Typography>
                    <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <Typography variant="body1">Discount ({ (discount * 100).toFixed(0) }%):</Typography>
                      <Typography variant="body1">-${totalDiscount.toFixed(2)}</Typography>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <Typography variant="h5">Total:</Typography>
                    <Typography variant="h5">${finalTotal.toFixed(2)}</Typography>
                  </div>
                  <div className="space-y-2 pt-4">
                    <Typography variant="body2" className="flex items-center"><Tag className="h-4 w-4 mr-2 text-orange-500"/>Have a promo code?</Typography>
                    <div className="flex space-x-2">
                      <InputOTP maxLength={6} value={promoCode} onChange={(value) => setPromoCode(value)}>
                        <InputOTPGroup className="flex-grow">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      <Button onClick={applyPromoCode} variant="outline" disabled={!promoCode || promoCode.length < 3}>Apply</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    size="lg" 
                    className="w-full bg-orange-500 hover:bg-orange-600" 
                    onClick={() => navigate('/checkout', { state: { cartItems, finalTotal, restaurantName: restaurantNameFromState }})}
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
      <footer className="bg-gray-800 text-white text-center p-6 mt-auto">
        <Typography variant="body2">&copy; {new Date().getFullYear()} FoodDash. All rights reserved.</Typography>
      </footer>
    </div>
  );
};

export default CartPage;