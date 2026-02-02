import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, Mail, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  title: string;
  status: 'pending' | 'replied' | 'closed';
  created_at: string;
}

interface RecentInquiriesListProps {
  inquiries: Inquiry[];
  isLoading?: boolean;
  onViewAll: () => void;
}

const statusConfig = {
  pending: { label: '미답변', variant: 'destructive' as const },
  replied: { label: '답변완료', variant: 'default' as const },
  closed: { label: '종결', variant: 'secondary' as const },
};

export function RecentInquiriesList({ inquiries, isLoading, onViewAll }: RecentInquiriesListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 bg-muted rounded w-40 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 border rounded-lg animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-2" />
              <div className="h-3 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          최근 문의 내역
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onViewAll} className="text-primary">
          전체보기 <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {inquiries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              최근 문의가 없습니다
            </p>
          ) : (
            inquiries.map((inquiry) => (
              <div 
                key={inquiry.id} 
                className="p-4 border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium text-foreground line-clamp-1 flex-1">
                    {inquiry.title}
                  </h4>
                  <Badge variant={statusConfig[inquiry.status].variant}>
                    {statusConfig[inquiry.status].label}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{inquiry.name}</span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {inquiry.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {inquiry.email}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {format(new Date(inquiry.created_at), 'PPP p', { locale: ko })}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
