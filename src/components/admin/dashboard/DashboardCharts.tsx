import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

interface WeeklyData {
  date: string;
  visitors: number;
  inquiries: number;
}

interface CategoryClickData {
  name: string;
  value: number;
}

interface DashboardChartsProps {
  weeklyData: WeeklyData[];
  categoryClicks: CategoryClickData[];
  isLoading?: boolean;
}

const CATEGORY_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(142, 76%, 36%)",
  "hsl(280, 65%, 60%)",
  "hsl(200, 80%, 50%)",
  "hsl(340, 75%, 55%)",
];

export function DashboardCharts({ weeklyData, categoryClicks, isLoading }: DashboardChartsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-5 bg-muted rounded w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded" />
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-5 bg-muted rounded w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const chartConfig = {
    visitors: {
      label: "방문자",
      color: "hsl(var(--primary))",
    },
    inquiries: {
      label: "문의",
      color: "hsl(var(--accent))",
    },
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Weekly Visitors & Inquiries Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">주간 방문자 및 문의량</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <LineChart data={weeklyData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="inquiries" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Category Clicks Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">카테고리별 클릭 비중</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryClicks}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                >
                  {categoryClicks.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-xs text-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
