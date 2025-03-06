
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  href?: string;
}

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  className,
  href 
}: StatsCardProps) => {
  const content = (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            
            {trend && (
              <div className="flex items-center mt-1">
                <span className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
                {description && (
                  <span className="text-xs text-muted-foreground ml-1">{description}</span>
                )}
              </div>
            )}
            
            {!trend && description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          
          <div className="rounded-full p-2 bg-primary/10">
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }

  return content;
};

export default StatsCard;
