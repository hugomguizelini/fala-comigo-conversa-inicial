
import React from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Users, ShoppingCart, Activity, CreditCard } from "lucide-react";

const demoChartData = [
  { name: "Jan", total: 1200 },
  { name: "Fev", total: 2100 },
  { name: "Mar", total: 1800 },
  { name: "Abr", total: 2400 },
  { name: "Mai", total: 2800 },
  { name: "Jun", total: 3200 },
];

const demoBarData = [
  { name: "Seg", value: 400 },
  { name: "Ter", value: 300 },
  { name: "Qua", value: 500 },
  { name: "Qui", value: 280 },
  { name: "Sex", value: 590 },
  { name: "Sáb", value: 320 },
  { name: "Dom", value: 250 },
];

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 24.532</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" /> +12.5%
              </span>
              comparado ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Usuários</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+342</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" /> +8.2%
              </span>
              comparado ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+1,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 flex items-center">
                <ArrowDown className="h-3 w-3 mr-1" /> -2.5%
              </span>
              comparado ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atividade</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" /> +7.2%
              </span>
              comparado ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
            <CardDescription>Receitas ao longo dos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demoChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Semanal</CardTitle>
            <CardDescription>Registros de atividade da última semana</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demoBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
