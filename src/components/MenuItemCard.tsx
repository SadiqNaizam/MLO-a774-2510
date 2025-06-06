import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { Typography } from '@/components/common/Typography'; // Assuming Typography component

export interface MenuItemCardProps {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  onAddToCart: (item: { id: string | number; name: string; price: number }) => void;
  // hasOptions?: boolean; // To indicate if customization is needed
  // onCustomize?: (id: string | number) => void; // If customization opens a dialog/sheet
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
}) => {
  console.log("Rendering MenuItemCard:", name);

  const handleAddToCartClick = () => {
    console.log("Add to cart clicked for:", name, id);
    onAddToCart({ id, name, price });
    // Potentially show a toast notification here using useToast
  };

  return (
    <Card className="flex flex-col md:flex-row overflow-hidden w-full transition-shadow duration-300 hover:shadow-md">
      {imageUrl && (
        <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={`Image of ${name}`}
            className="object-cover w-full h-32 md:h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            loading="lazy"
          />
        </div>
      )}
      <div className="flex flex-col justify-between flex-grow">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-semibold">
            <Typography variant="h5" as="h3">{name}</Typography>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-0 md:py-2 flex-grow">
          {description && (
            <Typography variant="body2" className="text-gray-600 line-clamp-2 text-sm">
              {description}
            </Typography>
          )}
        </CardContent>
        <CardFooter className="pt-2 md:pt-4 flex justify-between items-center">
          <Typography variant="h6" as="span" className="text-orange-600 font-bold">
            ${price.toFixed(2)}
          </Typography>
          <Button size="sm" onClick={handleAddToCartClick} aria-label={`Add ${name} to cart`}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default MenuItemCard;