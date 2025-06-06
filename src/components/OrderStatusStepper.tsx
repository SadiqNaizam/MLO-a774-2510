import React from 'react';
import { CheckCircle, Circle, Dot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // For conditional class names
import { Typography } from '@/components/common/Typography'; // Assuming Typography component

export interface OrderStep {
  id: string;
  name: string;
  description?: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface OrderStatusStepperProps {
  steps: OrderStep[];
  currentStepId?: string; // Optional, can be derived from steps if isActive is set
}

const OrderStatusStepper: React.FC<OrderStatusStepperProps> = ({ steps }) => {
  console.log("Rendering OrderStatusStepper with steps:", steps.length);

  if (!steps || steps.length === 0) {
    return <Typography>No order status information available.</Typography>;
  }

  return (
    <div className="w-full">
      <ol className="relative flex flex-col md:flex-row md:justify-between text-sm font-medium text-center text-gray-500">
        {steps.map((step, index) => {
          const isLastStep = index === steps.length - 1;
          const Icon = step.isCompleted ? CheckCircle : step.isActive ? Loader2 : Circle;
          const iconColor = step.isCompleted ? 'text-green-600' : step.isActive ? 'text-orange-500 animate-spin' : 'text-gray-400';
          const textColor = step.isCompleted || step.isActive ? 'text-orange-600' : 'text-gray-500';

          return (
            <li
              key={step.id}
              className={cn(
                "relative flex items-center md:flex-col md:items-center p-2 md:flex-1",
                { "md:w-full": !isLastStep }, // Ensure last step doesn't overextend connector
                textColor
              )}
            >
              {/* Connector Line (Horizontal for vertical layout, or between steps for horizontal) */}
              {!isLastStep && (
                <div className="hidden md:block absolute top-1/3 left-1/2 w-full h-0.5 bg-gray-200 -translate-x-1/2 transform -z-10"></div>
              )}
               {/* Vertical Connector for stacked layout (mobile first) */}
              {!isLastStep && (
                <div className="md:hidden absolute left-5 top-10 w-0.5 h-full bg-gray-200 transform -translate-x-1/2 -z-10"></div>
              )}

              <span className={cn("flex items-center justify-center w-10 h-10 rounded-full shrink-0",
                                 step.isCompleted ? 'bg-green-100' : step.isActive ? 'bg-orange-100' : 'bg-gray-100')}>
                <Icon className={cn("w-5 h-5", iconColor)} />
              </span>
              
              <div className="ml-4 md:ml-0 md:mt-2 text-left md:text-center">
                <Typography variant="body1" as="h3" className={cn("font-semibold", textColor)}>
                  {step.name}
                </Typography>
                {step.description && (
                  <Typography variant="caption" className="text-gray-500">
                    {step.description}
                  </Typography>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default OrderStatusStepper;