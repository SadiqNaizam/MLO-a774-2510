import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import MenuItemCard, { MenuItemCardProps } from '@/components/MenuItemCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/common/Typography';
import { ChevronDown, Star, Clock, ShoppingCart, PlusCircle, MinusCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"; // Assuming shadcn toast is used

interface RestaurantDetails {
  id: string;
  name: string;
  logoUrl: string;
  rating: number;
  deliveryEstimate: string;
  cuisineTypes: string[];
  menuCategories: {
    name: string;
    items: Omit<MenuItemCardProps, 'onAddToCart'>[];
  }[];
}

const placeholderRestaurantDetails: RestaurantDetails = {
  id: '1',
  name: 'The Pizza Place',
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/3595/3595458.png', // Placeholder logo
  rating: 4.5,
  deliveryEstimate: '25-35 min',
  cuisineTypes: ['Pizza', 'Italian', 'Fast Food'],
  menuCategories: [
    {
      name: 'Pizzas',
      items: [
        { id: 'p1', name: 'Margherita Pizza', description: 'Classic cheese and tomato pizza.', price: 12.99, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80' },
        { id: 'p2', name: 'Pepperoni Pizza', description: 'Loaded with pepperoni slices.', price: 14.99, imageUrl: 'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80' },
      ],
    },
    {
      name: 'Appetizers',
      items: [
        { id: 'a1', name: 'Garlic Bread', description: 'Warm garlic bread with herbs.', price: 5.99, imageUrl: 'https://images.unsplash.com/photo-1627308594192-7f01deb58333?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80' },
        { id: 'a2', name: 'Chicken Wings', description: 'Spicy chicken wings.', price: 8.99, imageUrl: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80' },
      ],
    },
     {
      name: 'Drinks',
      items: [
        { id: 'd1', name: 'Coca-Cola', description: 'Classic Coke.', price: 2.50, imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80' },
        { id: 'd2', name: 'Orange Juice', description: 'Freshly squeezed orange juice.', price: 3.00, imageUrl: 'https://images.unsplash.com/photo-1616013536046-4a7911333f93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80' },
      ],
    },
  ],
};

type CartItem = { id: string | number; name: string; price: number; quantity: number };

const RestaurantMenuPage = () => {
  console.log('RestaurantMenuPage loaded');
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [isCustomizationSheetOpen, setIsCustomizationSheetOpen] = useState(false);
  const [selectedItemForCustomization, setSelectedItemForCustomization] = useState<Omit<MenuItemCardProps, 'onAddToCart'> | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]); // Simple cart state for this page

  useEffect(() => {
    // Simulate fetching restaurant details
    console.log(`Fetching menu for restaurant ID: ${restaurantId}`);
    // In a real app, you'd fetch this data based on restaurantId
    if (restaurantId === placeholderRestaurantDetails.id) {
      setRestaurant(placeholderRestaurantDetails);
    } else {
      // Handle restaurant not found, perhaps navigate to a 404 page or show error
      console.error("Restaurant not found");
      // navigate('/not-found'); // Example
    }
  }, [restaurantId, navigate]);

  const handleAddToCart = (item: { id: string | number; name: string; price: number }) => {
    // For this example, some items might require customization via sheet
    const requiresCustomization = item.name.toLowerCase().includes("pizza"); // Example logic
    
    if (requiresCustomization) {
        const fullItemDetails = restaurant?.menuCategories
            .flatMap(cat => cat.items)
            .find(menuItem => menuItem.id === item.id);
        if (fullItemDetails) {
            setSelectedItemForCustomization(fullItemDetails);
            setIsCustomizationSheetOpen(true);
            return;
        }
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    toast({
      title: `${item.name} added to cart!`,
      description: `Price: $${item.price.toFixed(2)}`,
    });
    console.log('Added to cart:', item);
  };

  const handleCustomizationSubmit = () => {
    if (selectedItemForCustomization) {
      // Here you would handle selected customizations
      // For now, just add the base item
      setCart(prevCart => {
        const existingItem = prevCart.find(cartItem => cartItem.id === selectedItemForCustomization.id);
        if (existingItem) {
          return prevCart.map(cartItem =>
            cartItem.id === selectedItemForCustomization.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
          );
        }
        return [...prevCart, { ...selectedItemForCustomization, quantity: 1 }];
      });
      toast({
        title: `${selectedItemForCustomization.name} (customized) added to cart!`,
        description: `Price: $${selectedItemForCustomization.price.toFixed(2)}`,
      });
      setIsCustomizationSheetOpen(false);
      setSelectedItemForCustomization(null);
    }
  };


  if (!restaurant) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavigationMenu />
        <div className="flex-grow flex items-center justify-center">
          <Typography variant="h4">Loading restaurant details...</Typography>
        </div>
      </div>
    );
  }

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu />
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row items-center md:space-x-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4 md:mb-0 border-2 border-orange-200">
              <AvatarImage src={restaurant.logoUrl} alt={restaurant.name} />
              <AvatarFallback>{restaurant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <Typography variant="h1" as="h1" className="text-gray-800 mb-1">{restaurant.name}</Typography>
              <div className="flex items-center justify-center md:justify-start space-x-3 text-gray-600 mb-2">
                <span className="flex items-center"><Star className="h-5 w-5 text-yellow-500 fill-yellow-400 mr-1" /> {restaurant.rating.toFixed(1)}</span>
                <span className="flex items-center"><Clock className="h-5 w-5 mr-1" /> {restaurant.deliveryEstimate}</span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {restaurant.cuisineTypes.map(cuisine => (
                  <Badge key={cuisine} variant="secondary" className="bg-orange-100 text-orange-700">{cuisine}</Badge>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section>
          <Typography variant="h3" as="h2" className="mb-6 text-gray-700">Menu</Typography>
          {restaurant.menuCategories.map(category => (
            <Collapsible key={category.name} defaultOpen className="mb-6 bg-white rounded-lg shadow-sm overflow-hidden">
              <CollapsibleTrigger className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 transition-colors">
                <Typography variant="h5" as="h3">{category.name}</Typography>
                <ChevronDown className="h-5 w-5 transition-transform [&[data-state=open]]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items.map(item => (
                    <MenuItemCard
                      key={item.id}
                      {...item}
                      onAddToCart={() => handleAddToCart(item as any)} // Cast needed due to Omit in type
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </section>
      </main>

      {totalCartItems > 0 && (
        <div className="sticky bottom-0 bg-white p-4 shadow-t-lg border-t border-gray-200">
          <Button
            size="lg"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => navigate('/cart', { state: { cartItems: cart, restaurantName: restaurant.name }})}
          >
            <ShoppingCart className="mr-2 h-5 w-5" /> View Cart ({totalCartItems} {totalCartItems === 1 ? 'item' : 'items'})
          </Button>
        </div>
      )}
      
      <Sheet open={isCustomizationSheetOpen} onOpenChange={setIsCustomizationSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Customize {selectedItemForCustomization?.name}</SheetTitle>
            <SheetDescription>
              Make changes to your item. For now, this is a placeholder.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            {/* Placeholder for customization options e.g., RadioGroup, Checkbox */}
            <Typography variant="body1">Customization options would go here.</Typography>
            <Typography variant="body2" className="mt-2">Selected: {selectedItemForCustomization?.name}</Typography>
            <Typography variant="body2">Price: ${selectedItemForCustomization?.price.toFixed(2)}</Typography>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button onClick={handleCustomizationSubmit} className="bg-orange-500 hover:bg-orange-600">Add to Cart</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <footer className="bg-gray-800 text-white text-center p-6 mt-auto">
        <Typography variant="body2">&copy; {new Date().getFullYear()} FoodDash. All rights reserved.</Typography>
      </footer>
    </div>
  );
};

export default RestaurantMenuPage;