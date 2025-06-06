import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Carousel, { CarouselSlide } from '@/components/Carousel';
import RestaurantCard, { RestaurantCardProps } from '@/components/RestaurantCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/common/Typography';
import { Search, MapPin, Star, Utensils } from 'lucide-react';

const placeholderCarouselSlides: CarouselSlide[] = [
  {
    id: 1,
    altText: 'Delicious Pizza Deal',
    content: <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&h=600&q=80" alt="Delicious Pizza Deal" className="w-full h-full object-cover" />,
  },
  {
    id: 2,
    altText: 'Fresh Sushi Platter',
    content: <img src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&h=600&q=80" alt="Fresh Sushi Platter" className="w-full h-full object-cover" />,
  },
  {
    id: 3,
    altText: 'Hearty Burgers',
    content: <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&h=600&q=80" alt="Hearty Burgers" className="w-full h-full object-cover" />,
  },
];

const placeholderRestaurants: RestaurantCardProps[] = [
  { id: '1', name: 'The Pizza Place', imageUrl: 'https://images.unsplash.com/photo-1593504049358-74330451a6ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80', rating: 4.5, reviewCount: 150, cuisineTypes: ['Pizza', 'Italian'], deliveryTime: '25-35 min' },
  { id: '2', name: 'Sushi Express', imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80', rating: 4.2, reviewCount: 95, cuisineTypes: ['Sushi', 'Japanese'], deliveryTime: '30-40 min' },
  { id: '3', name: 'Burger Hub', imageUrl: 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80', rating: 4.7, reviewCount: 210, cuisineTypes: ['Burgers', 'American'], deliveryTime: '20-30 min' },
  { id: '4', name: 'Curry Corner', imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80', rating: 4.3, reviewCount: 120, cuisineTypes: ['Indian', 'Curry'], deliveryTime: '35-45 min' },
];

const HomePageRestaurantListingPage = () => {
  console.log('HomePage/RestaurantListingPage loaded');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleRestaurantClick = (id: string | number) => {
    navigate(`/restaurant/${id}/menu`);
  };

  const filteredRestaurants = placeholderRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisineTypes.some(cuisine => cuisine.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const cuisineFilters = ['All', 'Pizza', 'Sushi', 'Burgers', 'Indian', 'Nearby', 'Top Rated'];
  const [activeFilter, setActiveFilter] = useState('All');


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu />
      <main className="flex-grow">
        <section className="mb-8">
          <Carousel slides={placeholderCarouselSlides} />
        </section>

        <section className="container mx-auto px-4 py-6">
          <Typography variant="h2" as="h1" className="text-center mb-2 text-gray-800">
            Find Your Next Meal
          </Typography>
          <Typography variant="subtitle1" as="p" className="text-center text-gray-600 mb-8">
            Search for your favorite restaurants or cuisines.
          </Typography>
          <div className="max-w-2xl mx-auto mb-8 flex items-center space-x-2 bg-white p-2 rounded-lg shadow">
            <Input
              type="text"
              placeholder="Search restaurants, cuisines..."
              className="flex-grow border-0 focus:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search restaurants and cuisines"
            />
            <Button type="button" size="icon" className="bg-orange-500 hover:bg-orange-600">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          <div className="mb-8">
            <Typography variant="h5" as="h2" className="mb-3 text-gray-700">Filter by Category:</Typography>
            <ScrollArea className="w-full whitespace-nowrap pb-2">
              <div className="flex space-x-2">
                {cuisineFilters.map(filter => (
                  <Button
                    key={filter}
                    variant={activeFilter === filter ? "default" : "outline"}
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full ${activeFilter === filter ? 'bg-orange-500 text-white hover:bg-orange-600' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  >
                    {filter === 'Nearby' && <MapPin className="mr-2 h-4 w-4" />}
                    {filter === 'Top Rated' && <Star className="mr-2 h-4 w-4" />}
                    {filter !== 'Nearby' && filter !== 'Top Rated' && filter !== 'All' && <Utensils className="mr-2 h-4 w-4" />}
                    {filter}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12">
           <Typography variant="h4" as="h2" className="mb-6 text-gray-800">
            {activeFilter === 'All' ? 'All Restaurants' : `Showing ${activeFilter} Restaurants`}
          </Typography>
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRestaurants.map(restaurant => (
                <RestaurantCard
                  key={restaurant.id}
                  {...restaurant}
                  onClick={handleRestaurantClick}
                />
              ))}
            </div>
          ) : (
            <Typography variant="body1" className="text-center text-gray-500 py-10">
              No restaurants found matching your criteria. Try a different search or filter.
            </Typography>
          )}
        </section>
      </main>
      <footer className="bg-gray-800 text-white text-center p-6 mt-auto">
        <Typography variant="body2">&copy; {new Date().getFullYear()} FoodDash. All rights reserved.</Typography>
      </footer>
    </div>
  );
};

export default HomePageRestaurantListingPage;