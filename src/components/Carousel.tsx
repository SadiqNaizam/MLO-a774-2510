import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from "@/components/ui/card"; // Using shadcn Card for slide styling
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselSlide {
  id: string | number;
  content: React.ReactNode; // Allows for complex content within a slide
  altText?: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
  options?: Parameters<typeof useEmblaCarousel>[0];
  autoplayOptions?: Parameters<typeof Autoplay>[0];
  showArrows?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({
  slides,
  options = { loop: true },
  autoplayOptions = { delay: 4000, stopOnInteraction: false },
  showArrows = true,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay(autoplayOptions)]);

  console.log("Rendering Carousel with", slides.length, "slides.");

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!slides || slides.length === 0) {
    return (
      <div className="w-full aspect-video bg-gray-100 flex items-center justify-center text-gray-500">
        No slides to display.
      </div>
    );
  }

  return (
    <div className="embla relative overflow-hidden" ref={emblaRef}>
      <div className="embla__container flex">
        {slides.map((slide) => (
          <div className="embla__slide flex-[0_0_100%] min-w-0" key={slide.id}>
            <Card className="m-1 md:m-2 shadow-none border-none bg-transparent">
              <CardContent className="flex aspect-[16/7] md:aspect-[16/6] items-center justify-center p-0">
                {/* Content can be an image or more complex JSX */}
                {slide.content}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {showArrows && emblaApi && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="embla__prev absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
            onClick={scrollPrev}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="embla__next absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
            onClick={scrollNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
      {/* Optional: Add Dots for navigation */}
    </div>
  );
};

export default Carousel;