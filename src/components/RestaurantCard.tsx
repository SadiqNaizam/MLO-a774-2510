import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock } from 'lucide-react';
import { Typography } from '@/components/common/Typography'; // Assuming Typography component

export interface RestaurantCardProps {
  id: string | number;
  name: string;
  imageUrl: string;
  rating: number; // e.g., 4.5
  reviewCount?: number; // e.g., 120
  cuisineTypes: string[]; // e.g., ["Italian", "Pizza"]
  deliveryTime?: string; // e.g., "25-35 min"
  onClick?: (id: string | number) => void;
  // promoBadge?: string; // e.g., "20% OFF"
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  rating,
  reviewCount,
  cuisineTypes,
  deliveryTime,
  onClick,
}) => {
  console.log("Rendering RestaurantCard:", name);

  const handleCardClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <Card
      className={`w-full overflow-hidden transition-all duration-300 hover:shadow-xl ${onClick ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
      tabIndex={onClick ? 0 : -1}
      onKeyPress={onClick ? (e) => e.key === 'Enter' && handleCardClick() : undefined}
      aria-label={`View details for ${name}`}
    >
      <CardHeader className="p-0">
        <div className="aspect-[16/9] bg-gray-100">
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={`Image of ${name}`}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            loading="lazy"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-lg font-semibold leading-tight">
          <Typography variant="h4" as="h3">{name}</Typography>
        </CardTitle>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <Typography variant="body2" as="span">{rating.toFixed(1)}</Typography>
          {reviewCount && <Typography variant="body2" as="span">({reviewCount} reviews)</Typography>}
        </div>

        <Typography variant="body2" className="text-gray-500 line-clamp-1">
          {cuisineTypes.join(', ')}
        </Typography>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        {deliveryTime && (
          <div className="flex items-center space-x-1 text-sm text-gray-700">
            <Clock className="h-4 w-4" />
            <Typography variant="caption" as="span">{deliveryTime}</Typography>
          </div>
        )}
        {/* Could add a small badge here for promos if needed */}
        {/* <Badge variant="destructive">{promoBadge}</Badge> */}
      </CardFooter>
    </Card>
  );
};

export default RestaurantCard;