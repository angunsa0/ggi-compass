import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Download, Globe, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SummaryData {
  todayVisitors: number;
  yesterdayVisitors: number;
  todayPageViews: number;
  yesterdayPageViews: number;
  newInquiries: number;
  unansweredInquiries: number;
  catalogDownloads: number;
  trafficSources: {
    naver: number;
    google: number;
    direct: number;
    other: number;
  };
}

interface DashboardSummaryCardsProps {
  data: SummaryData;
  isLoading?: boolean;
}

function TrendIndicator({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) {
    return <span className="text-xs text-muted-foreground flex items-center gap-1"><Minus className="h-3 w-3" /> 전일 데이터 없음</span>;
  }
  
  const diff = current - previous;
  const percent = Math.round((diff / previous) * 100);
  
  if (diff > 0) {
    return <span className="text-xs text-green-600 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> +{percent}% 전일 대비</span>;
  } else if (diff < 0) {
    return <span className="text-xs text-red-600 flex items-center gap-1"><TrendingDown className="h-3 w-3" /> {percent}% 전일 대비</span>;
  }
  return <span className="text-xs text-muted-foreground flex items-center gap-1"><Minus className="h-3 w-3" /> 전일과 동일</span>;
}

export function DashboardSummaryCards({ data, isLoading }: DashboardSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-24" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-2" />
              <div className="h-3 bg-muted rounded w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalTraffic = data.trafficSources.naver + data.trafficSources.google + data.trafficSources.direct + data.trafficSources.other;
  const topSource = Object.entries(data.trafficSources).sort((a, b) => b[1] - a[1])[0];
  const sourceNames: Record<string, string> = {
    naver: '네이버',
    google: '구글',
    direct: '직접 방문',
    other: '기타'
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* Today's Visitors */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">오늘 방문자</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{data.todayVisitors.toLocaleString()}</div>
          <TrendIndicator current={data.todayVisitors} previous={data.yesterdayVisitors} />
          <p className="text-xs text-muted-foreground mt-1">
            페이지뷰: {data.todayPageViews.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* New Inquiries */}
      <Card className="border-l-4 border-l-accent">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">신규 문의</CardTitle>
          <FileText className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{data.newInquiries}</div>
          {data.unansweredInquiries > 0 ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
              미답변 {data.unansweredInquiries}건
            </span>
          ) : (
            <span className="text-xs text-green-600">모두 답변 완료</span>
          )}
        </CardContent>
      </Card>

      {/* Catalog Downloads */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">카탈로그 조회</CardTitle>
          <Download className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{data.catalogDownloads}</div>
          <p className="text-xs text-muted-foreground">
            오늘 총 <span className="font-semibold text-green-600">{data.catalogDownloads}명</span>이 카탈로그를 확인했습니다
          </p>
        </CardContent>
      </Card>

      {/* Traffic Sources */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">주요 유입 경로</CardTitle>
          <Globe className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{sourceNames[topSource[0]]}</div>
          <p className="text-xs text-muted-foreground">
            {totalTraffic > 0 ? Math.round((topSource[1] / totalTraffic) * 100) : 0}% 
            ({topSource[1].toLocaleString()}명)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
