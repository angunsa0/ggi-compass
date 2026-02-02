import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ShoppingCart, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface BulkInquiry {
  id: string;
  company: string;
  contact: string;
  productType: string;
  quantity: string;
  created_at: string;
  isProcurement: boolean;
}

interface Partner {
  id: string;
  name: string;
  type: 'dealer' | 'partner';
  created_at: string;
}

interface B2BSectionProps {
  bulkInquiries: BulkInquiry[];
  partners: Partner[];
  isLoading?: boolean;
}

export function B2BSection({ bulkInquiries, partners, isLoading }: B2BSectionProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-5 bg-muted rounded w-48" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border rounded-lg">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-5 bg-muted rounded w-48" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="p-3 border rounded-lg">
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-3 bg-muted rounded w-1/4" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Bulk / Procurement Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-primary" />
            대량구매 / 나라장터 문의
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bulkInquiries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                대량구매 문의가 없습니다
              </p>
            ) : (
              bulkInquiries.map((inquiry) => (
                <div 
                  key={inquiry.id} 
                  className="p-4 border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{inquiry.company}</span>
                    </div>
                    {inquiry.isProcurement && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        나라장터
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <span>제품: {inquiry.productType}</span>
                    <span>수량: {inquiry.quantity}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(inquiry.created_at), 'PPP', { locale: ko })}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Partners / Dealers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            신규 파트너사 / 대리점
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {partners.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                신규 파트너가 없습니다
              </p>
            ) : (
              partners.map((partner) => (
                <div 
                  key={partner.id} 
                  className="flex items-center gap-4 p-3 border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${partner.type === 'dealer' ? 'bg-accent/20' : 'bg-primary/10'}`}>
                    <Building2 className={`h-4 w-4 ${partner.type === 'dealer' ? 'text-accent-foreground' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{partner.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {partner.type === 'dealer' ? '대리점' : '파트너사'} · {format(new Date(partner.created_at), 'PP', { locale: ko })}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
