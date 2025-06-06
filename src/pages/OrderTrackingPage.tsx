import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import OrderStatusStepper, { OrderStep } from '@/components/OrderStatusStepper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Typography } from '@/components/common/Typography';
import { PackageCheck, ListOrdered, Info, RotateCcw } from 'lucide-react';

type CartItem = { id: string | number; name: string; price: number; quantity: number; imageUrl?: string };

interface OrderDetails {
  orderId: string;
  restaurantName: string;
  items: CartItem[];
  totalAmount: number;
  orderDate: string;
  estimatedDelivery: string;
  status: 'Order Confirmed' | 'Preparing Food' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  deliveryAddress?: any; // from checkout form data
}

const initialSteps: OrderStep[] = [
  { id: 'confirmed', name: 'Order Confirmed', description: 'We have received your order.', isCompleted: false, isActive: false },
  { id: 'preparing', name: 'Preparing Food', description: 'The restaurant is preparing your meal.', isCompleted: false, isActive: false },
  { id: 'delivery', name: 'Out for Delivery', description: 'Your order is on its way!', isCompleted: false, isActive: false },
  { id: 'delivered', name: 'Delivered', description: 'Enjoy your meal!', isCompleted: false, isActive: false },
];

// Sample past orders
const samplePastOrders: OrderDetails[] = [
    { orderId: 'ORD-PAST01', restaurantName: 'Sushi Express', items: [{id: 's1', name: 'Salmon Sushi Set', price: 18.99, quantity: 1}], totalAmount: 18.99, orderDate: '2023-10-15', estimatedDelivery: 'N/A', status: 'Delivered' },
    { orderId: 'ORD-PAST02', restaurantName: 'Burger Hub', items: [{id: 'b1', name: 'Classic Cheeseburger', price: 9.50, quantity: 2}], totalAmount: 19.00, orderDate: '2023-10-10', estimatedDelivery: 'N/A', status: 'Delivered' },
];


const OrderTrackingPage = () => {
  console.log('OrderTrackingPage loaded');
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [currentOrder, setCurrentOrder] = useState<OrderDetails | null>(null);
  const [orderSteps, setOrderSteps] = useState<OrderStep[]>(initialSteps);
  const [pastOrders, setPastOrders] = useState<OrderDetails[]>(samplePastOrders);

  useEffect(() => {
    // Simulate fetching order details based on orderId
    // If coming from checkout, location.state will have details
    if (location.state?.orderDetails && location.state?.cartItems) {
      const { orderDetails, cartItems, finalTotal, restaurantName } = location.state;
      const newOrder: OrderDetails = {
        orderId: orderId!,
        restaurantName: restaurantName,
        items: cartItems,
        totalAmount: finalTotal,
        orderDate: new Date().toLocaleDateString(),
        estimatedDelivery: '30-45 minutes', // Placeholder
        status: 'Order Confirmed',
        deliveryAddress: orderDetails.deliveryAddress,
      };
      setCurrentOrder(newOrder);
      setPastOrders(prev => [newOrder, ...prev.filter(o => o.orderId !== orderId)]); // Add to past orders for history view
    } else {
      // Try to find in past orders if navigating directly
      const foundOrder = pastOrders.find(o => o.orderId === orderId);
      if (foundOrder) {
        setCurrentOrder(foundOrder);
      } else {
        console.warn("Order details not found for ID:", orderId);
        // setCurrentOrder(null); // Or show a "not found" message
      }
    }
  }, [orderId, location.state]);


  useEffect(() => {
    if (currentOrder) {
      const updatedSteps = initialSteps.map(step => {
        let isCompleted = false;
        let isActive = false;
        if (currentOrder.status === 'Order Confirmed') {
          if (step.id === 'confirmed') isActive = true;
        } else if (currentOrder.status === 'Preparing Food') {
          if (step.id === 'confirmed') isCompleted = true;
          if (step.id === 'preparing') isActive = true;
        } else if (currentOrder.status === 'Out for Delivery') {
          if (step.id === 'confirmed' || step.id === 'preparing') isCompleted = true;
          if (step.id === 'delivery') isActive = true;
        } else if (currentOrder.status === 'Delivered') {
          isCompleted = true;
          isActive = step.id === 'delivered';
        } else if (currentOrder.status === 'Cancelled') {
            // Potentially show a different set of steps or indicate cancellation
            return {...step, name: step.id === 'confirmed' ? "Order Cancelled" : step.name, isCompleted: false, isActive: step.id === 'confirmed'};
        }
        return { ...step, isCompleted, isActive };
      });
      setOrderSteps(updatedSteps);
    }
  }, [currentOrder]);


  // Simulate status updates for demo purposes
  useEffect(() => {
    if (currentOrder && currentOrder.status !== 'Delivered' && currentOrder.status !== 'Cancelled') {
      const timers: NodeJS.Timeout[] = [];
      if (currentOrder.status === 'Order Confirmed') {
        timers.push(setTimeout(() => setCurrentOrder(o => o ? {...o, status: 'Preparing Food'} : null), 5000));
      }
      if (currentOrder.status === 'Preparing Food' || (currentOrder.status === 'Order Confirmed' && !timers.length)) {
         timers.push(setTimeout(() => setCurrentOrder(o => o ? {...o, status: 'Out for Delivery'} : null), 10000));
      }
      if (currentOrder.status === 'Out for Delivery' || (currentOrder.status === 'Preparing Food' && !timers.length)) {
         timers.push(setTimeout(() => setCurrentOrder(o => o ? {...o, status: 'Delivered'} : null), 15000));
      }
      return () => timers.forEach(clearTimeout);
    }
  }, [currentOrder?.status]);


  const handleReorder = (orderToReorder: OrderDetails) => {
    console.log("Reordering:", orderToReorder.orderId);
    // Navigate to cart with items, or directly to checkout if simple reorder
    // For now, let's imagine it takes you to the restaurant menu page of the first item's restaurant
    // Or find the restaurant by name. This is a simplified example.
    navigate(`/`, { state: { message: `Reordering items from ${orderToReorder.restaurantName}. Please add to cart.` } });
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Typography variant="h2" as="h1" className="mb-8 text-gray-800">Order Status & History</Typography>

        <Tabs defaultValue={currentOrder ? "tracking" : "history"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-1/2 mx-auto mb-6">
            <TabsTrigger value="tracking" disabled={!currentOrder && !!orderId}>
                <PackageCheck className="mr-2 h-4 w-4" /> Current Order Tracking
            </TabsTrigger>
            <TabsTrigger value="history">
                <ListOrdered className="mr-2 h-4 w-4" /> Order History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracking">
            {currentOrder ? (
              <Card className="shadow-lg">
                <CardHeader className="bg-gray-100 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Order #{currentOrder.orderId}</CardTitle>
                        <CardDescription>From: {currentOrder.restaurantName} | Placed: {currentOrder.orderDate}</CardDescription>
                    </div>
                    <Badge variant={currentOrder.status === 'Delivered' ? 'default' : (currentOrder.status === 'Cancelled' ? 'destructive' : 'secondary')} 
                           className={`${currentOrder.status === 'Delivered' ? 'bg-green-500' : (currentOrder.status === 'Cancelled' ? '' : 'bg-orange-500')} text-white`}>
                        {currentOrder.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {currentOrder.status === 'Cancelled' ? (
                     <Alert variant="destructive">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Order Cancelled</AlertTitle>
                        <AlertDescription>
                            This order has been cancelled. If you have any questions, please contact support.
                        </AlertDescription>
                    </Alert>
                  ) : (
                    <OrderStatusStepper steps={orderSteps} />
                  )}
                  
                  <div className="mt-6">
                    <Typography variant="h5" as="h3" className="mb-2">Order Summary</Typography>
                    <ScrollArea className="h-[150px] border rounded-md p-3">
                      {currentOrder.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm py-1">
                          <span>{item.name} (x{item.quantity})</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </ScrollArea>
                    <div className="flex justify-between font-semibold text-md pt-2 mt-2 border-t">
                      <span>Total Paid:</span>
                      <span>${currentOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {currentOrder.deliveryAddress && (
                     <div className="mt-4">
                        <Typography variant="h6" as="h4" className="mb-1">Delivery To:</Typography>
                        <Typography variant="body2" className="text-gray-600">
                            {currentOrder.deliveryAddress.street}, {currentOrder.deliveryAddress.city}, {currentOrder.deliveryAddress.state} {currentOrder.deliveryAddress.zip}
                        </Typography>
                     </div>
                  )}

                  {currentOrder.status !== 'Delivered' && currentOrder.status !== 'Cancelled' && (
                    <Alert className="mt-6">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Estimated Delivery Time</AlertTitle>
                      <AlertDescription>
                        Your order is expected to arrive in approximately <span className="font-semibold">{currentOrder.estimatedDelivery}</span>.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                {currentOrder.status === 'Delivered' && (
                    <CardFooter className="flex justify-end">
                        <Button onClick={() => handleReorder(currentOrder)}>
                            <RotateCcw className="mr-2 h-4 w-4" /> Reorder
                        </Button>
                    </CardFooter>
                )}
              </Card>
            ) : (
                <Card className="shadow-md">
                    <CardContent className="p-10 text-center">
                        <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <Typography variant="h4" className="mb-2">No Active Order Selected</Typography>
                        <Typography variant="body1" className="text-gray-600">
                            {orderId ? `Could not find details for order #${orderId}.` : "Select an order from history or place a new one."}
                        </Typography>
                        <Button onClick={() => navigate('/')} className="mt-6">Browse Restaurants</Button>
                    </CardContent>
                </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Past Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {pastOrders.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {pastOrders.map(order => (
                        <Card key={order.orderId} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-base">Order #{order.orderId}</CardTitle>
                                    <CardDescription>From: {order.restaurantName} | Date: {order.orderDate}</CardDescription>
                                </div>
                                <Badge variant={order.status === 'Delivered' ? 'default' : 'destructive'}
                                       className={`${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {order.status}
                                </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="text-sm">
                            <Typography variant="body2">Items: {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</Typography>
                            <Typography variant="body2" className="font-semibold">Total: ${order.totalAmount.toFixed(2)}</Typography>
                          </CardContent>
                          <CardFooter className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/order/${order.orderId}/status`)}>View Details</Button>
                            {order.status === 'Delivered' && <Button size="sm" onClick={() => handleReorder(order)}><RotateCcw className="mr-1 h-3 w-3"/> Reorder</Button>}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <Typography variant="body1" className="text-center text-gray-500 py-10">No past orders found.</Typography>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
       <footer className="bg-gray-800 text-white text-center p-6 mt-auto">
        <Typography variant="body2">&copy; {new Date().getFullYear()} FoodDash. All rights reserved.</Typography>
      </footer>
    </div>
  );
};

export default OrderTrackingPage;