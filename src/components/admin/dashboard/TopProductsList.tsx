import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, TrendingUp } from "lucide-react";

interface ProductView {
  id: string;
  title: string;
  category: string;
  views: number;
  trend: 'up' | 'down' | 'stable';
}

interface TopProductsListProps {
  products: ProductView[];
  isLoading?: boolean;
}

export function TopProductsList({ products, isLoading }: TopProductsListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 bg-muted rounded w-40 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="h-8 w-8 bg-muted rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-3/4 mb-1" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
              <div className="h-4 bg-muted rounded w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          제품 조회수 TOP 5
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              조회 데이터가 없습니다
            </p>
          ) : (
            products.map((product, index) => (
              <div 
                key={product.id} 
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{product.title}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">{product.views.toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
