
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useIsMobile, useIsSmallMobile } from "@/hooks/use-mobile";

const ReportsSummaryCards = () => {
  const isMobile = useIsMobile();
  const isSmallMobile = useIsSmallMobile();
  
  // Dados simulados para os cards
  const summaryData = [
    {
      title: "Impressões",
      value: "1.2M",
      change: "+12.5%",
      isPositive: true,
    },
    {
      title: "Cliques",
      value: "48.2K",
      change: "+8.3%",
      isPositive: true,
    },
    {
      title: "CTR",
      value: "3.8%",
      change: "-0.6%",
      isPositive: false,
    },
    {
      title: "Conversões",
      value: "2,845",
      change: "+15.7%",
      isPositive: true,
    },
  ];

  return (
    <div className={`grid gap-3 ${
      isSmallMobile ? 'grid-cols-2' : isMobile ? 'grid-cols-2 sm:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'
    }`}>
      {summaryData.map((item, index) => (
        <Card key={index} className="shadow-sm">
          <CardContent className={`${isSmallMobile ? 'p-3' : 'p-4'}`}>
            <p className={`${isSmallMobile ? 'text-xs' : 'text-sm'} font-medium text-muted-foreground`}>
              {item.title}
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className={`${isSmallMobile ? 'text-lg' : 'text-2xl'} font-bold`}>
                {item.value}
              </p>
              <div className={`flex items-center space-x-1 ${isSmallMobile ? 'text-xs' : 'text-sm'} ${
                item.isPositive ? 'text-green-600' : 'text-red-500'
              }`}>
                {item.isPositive ? (
                  <TrendingUp className={`${isSmallMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                ) : (
                  <TrendingDown className={`${isSmallMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                )}
                <span>{item.change}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReportsSummaryCards;
