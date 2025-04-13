
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

const ReportsSummaryCards = () => {
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryData.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-2xl font-bold">{item.value}</p>
              <div className={`flex items-center space-x-1 text-sm ${
                item.isPositive ? 'text-green-600' : 'text-red-500'
              }`}>
                {item.isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
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
