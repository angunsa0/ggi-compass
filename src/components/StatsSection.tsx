import { BarChart, Bar, XAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { CheckCircle, TrendingUp } from 'lucide-react';

const qualityData = [
  { name: '기능성', value: 97, color: 'hsl(220, 60%, 12%)' },
  { name: '디자인', value: 94, color: 'hsl(220, 60%, 12%)' },
  { name: 'A/S', value: 98, color: 'hsl(351, 97%, 43%)' },
  { name: '가격', value: 92, color: 'hsl(220, 60%, 12%)' },
];

const areaData = [
  { name: '수도권', value: 45, color: 'hsl(220, 60%, 12%)' },
  { name: '충청권', value: 25, color: 'hsl(351, 97%, 43%)' },
  { name: '경상권', value: 20, color: 'hsl(217, 33%, 17%)' },
  { name: '기타', value: 10, color: 'hsl(215, 20%, 80%)' },
];

export const StatsSection = () => {
  return (
    <section id="stats" className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl font-black text-primary mb-4">왜 지지아이 인프라인가?</h2>
          <p className="text-muted-foreground">조달 가구 시장에서의 경쟁력과 신뢰성을 시각화된 데이터로 확인하세요.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Card 1 - Quality Score */}
          <div className="p-8 bg-secondary rounded-2xl">
            <h4 className="font-bold mb-4 text-muted-foreground uppercase text-xs tracking-widest">Quality Score</h4>
            <div className="flex items-end space-x-2 mb-6">
              <span className="text-5xl font-black text-primary">98%</span>
              <span className="text-sm text-accent font-bold mb-1 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" /> 2.1%
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">납품 후 품질 만족도 조사에서 98%의 긍정 평가를 기록했습니다.</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={qualityData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                    {qualityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 2 - Female-Owned Enterprise */}
          <div className="p-8 bg-primary rounded-2xl text-primary-foreground">
            <h4 className="font-bold mb-4 text-accent uppercase text-xs tracking-widest">Female-Owned Enterprise</h4>
            <h3 className="text-2xl font-bold mb-6">여성기업 우선구매 제도</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3 text-sm">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span>공공기관 여성기업 제품 의무 구매 비율 준수</span>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span>최대 5천만 원 이하 1인 수의계약 가능</span>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span>조달청 입찰 가점 및 적격심사 우대</span>
              </li>
            </ul>
            <div className="pt-6 border-t border-primary-foreground/10">
              <p className="text-xs text-primary-foreground/60">행정 효율은 높이고 계약 과정은 간소화합니다.</p>
            </div>
          </div>

          {/* Card 3 - Supply Area */}
          <div className="p-8 bg-secondary rounded-2xl">
            <h4 className="font-bold mb-4 text-muted-foreground uppercase text-xs tracking-widest">Supply Area</h4>
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={areaData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {areaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm font-bold text-primary">경기도 거점 전국 유통망 확보</p>
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              {areaData.map((item) => (
                <div key={item.name} className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
