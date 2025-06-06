import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Typography } from '@/components/common/Typography';
import { useToast } from "@/components/ui/use-toast";
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CreditCard, MapPin, Truck } from 'lucide-react';


const addressSchema = z.object({
  street: z.string().min(5, "Street address is too short"),
  city: z.string().min(2, "City name is too short"),
  state: z.string().min(2, "State is required"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  country: z.string().min(2, "Country is required"),
});

const paymentSchema = z.object({
  method: z.enum(["card", "paypal", "cod"], { required_error: "Payment method is required" }),
  cardNumber: z.string().optional(), // Add more specific validation if 'card'
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  saveCard: z.boolean().optional(),
});

const checkoutSchema = z.object({
  deliveryAddress: addressSchema,
  paymentDetails: paymentSchema,
  notes: z.string().optional(),
  agreeTerms: z.boolean().refine(val => val === true, { message: "You must agree to the terms and conditions."})
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

type CartItem = { id: string | number; name: string; price: number; quantity: number; imageUrl?: string };

const CheckoutPage = () => {
  console.log('CheckoutPage loaded');
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const cartItems: CartItem[] = location.state?.cartItems || [];
  const finalTotal: number = location.state?.finalTotal || 0;
  const restaurantName: string = location.state?.restaurantName || "the restaurant";

  const { control, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: { street: '', city: '', state: '', zip: '', country: 'USA' },
      paymentDetails: { method: undefined, saveCard: false },
      agreeTerms: false,
    },
  });

  const onSubmit: SubmitHandler<CheckoutFormData> = (data) => {
    console.log('Checkout form submitted:', data);
    // Simulate order placement
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    toast({
      title: "Order Placed Successfully!",
      description: `Your order #${orderId} from ${restaurantName} is confirmed. Total: $${finalTotal.toFixed(2)}`,
    });
    // Navigate to order tracking page
    navigate(`/order/${orderId}/status`, { state: { orderDetails: data, cartItems, finalTotal, restaurantName } });
  };
  
  if (cartItems.length === 0) {
     // Redirect if cart is empty (e.g., direct navigation or state lost)
    React.useEffect(() => {
      toast({ title: "Your cart is empty.", description: "Please add items to your cart before checking out.", variant: "destructive" });
      navigate('/cart');
    }, [navigate, toast]);
    return null; // Or a loading/redirecting message
  }


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavigationMenu />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Typography variant="h2" as="h1" className="mb-8 text-center text-gray-800">Secure Checkout</Typography>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Accordion type="single" collapsible defaultValue="delivery" className="w-full">
              <AccordionItem value="delivery" className="bg-white rounded-lg shadow-md">
                <AccordionTrigger className="p-6 hover:no-underline">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-6 w-6 text-orange-500" />
                    <Typography variant="h4" as="h2">Delivery Address</Typography>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="street">Street Address</Label>
                      <Controller name="deliveryAddress.street" control={control} render={({ field }) => <Input id="street" {...field} placeholder="123 Main St" />} />
                      {errors.deliveryAddress?.street && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.street.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Controller name="deliveryAddress.city" control={control} render={({ field }) => <Input id="city" {...field} placeholder="Anytown" />} />
                      {errors.deliveryAddress?.city && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.city.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="state">State / Province</Label>
                      <Controller name="deliveryAddress.state" control={control} render={({ field }) => <Input id="state" {...field} placeholder="CA" />} />
                      {errors.deliveryAddress?.state && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.state.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP / Postal Code</Label>
                      <Controller name="deliveryAddress.zip" control={control} render={({ field }) => <Input id="zip" {...field} placeholder="90210" />} />
                      {errors.deliveryAddress?.zip && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.zip.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="country">Country</Label>
                        <Controller
                            name="deliveryAddress.country"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger id="country">
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USA">United States</SelectItem>
                                        <SelectItem value="Canada">Canada</SelectItem>
                                        <SelectItem value="UK">United Kingdom</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                         {errors.deliveryAddress?.country && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.country.message}</p>}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment" className="bg-white rounded-lg shadow-md mt-6">
                <AccordionTrigger className="p-6 hover:no-underline">
                  <div className="flex items-center space-x-3">
                     <CreditCard className="h-6 w-6 text-orange-500" />
                     <Typography variant="h4" as="h2">Payment Method</Typography>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 border-t">
                  <Controller
                    name="paymentDetails.method"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                        <Label className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50 cursor-pointer has-[:checked]:bg-orange-50 has-[:checked]:border-orange-500">
                          <RadioGroupItem value="card" id="card" />
                          <span>Credit/Debit Card</span>
                        </Label>
                        <Label className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50 cursor-pointer has-[:checked]:bg-orange-50 has-[:checked]:border-orange-500">
                          <RadioGroupItem value="paypal" id="paypal" />
                          <span>PayPal</span>
                        </Label>
                        <Label className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50 cursor-pointer has-[:checked]:bg-orange-50 has-[:checked]:border-orange-500">
                          <RadioGroupItem value="cod" id="cod" />
                           <span>Cash on Delivery</span>
                        </Label>
                      </RadioGroup>
                    )}
                  />
                  {errors.paymentDetails?.method && <p className="text-red-500 text-sm mt-2">{errors.paymentDetails.method.message}</p>}
                  {/* TODO: Add conditional fields for card details */}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Card className="bg-white rounded-lg shadow-md">
              <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Truck className="h-6 w-6 text-orange-500" />
                    <span>Delivery Options & Notes</span>
                  </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="notes">Special Instructions / Notes</Label>
                <Controller name="notes" control={control} render={({ field }) => <Input as="textarea" id="notes" {...field} placeholder="e.g., Leave at front door." rows={3} />} />

                <div className="flex items-center space-x-2 mt-4">
                  <Controller name="agreeTerms" control={control} render={({ field }) => (
                    <Checkbox id="agreeTerms" checked={field.value} onCheckedChange={field.onChange} />
                  )} />
                  <Label htmlFor="agreeTerms" className="text-sm font-normal">
                    I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Terms and Conditions</a>.
                  </Label>
                </div>
                {errors.agreeTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeTerms.message}</p>}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-md sticky top-24"> {/* Sticky summary */}
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <Typography variant="caption" className="text-gray-500">From: {restaurantName}</Typography>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] pr-3 mb-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <Typography variant="body2" className="font-medium">{item.name}</Typography>
                        <Typography variant="caption" className="text-gray-500">Qty: {item.quantity}</Typography>
                      </div>
                      <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
                    </div>
                  ))}
                </ScrollArea>
                <div className="flex justify-between pt-4 border-t">
                  <Typography variant="h5">Total to Pay:</Typography>
                  <Typography variant="h5" className="text-orange-600">${finalTotal.toFixed(2)}</Typography>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700">
                  Place Order
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </main>
       <footer className="bg-gray-800 text-white text-center p-6 mt-auto">
        <Typography variant="body2">&copy; {new Date().getFullYear()} FoodDash. All rights reserved.</Typography>
      </footer>
    </div>
  );
};

export default CheckoutPage;