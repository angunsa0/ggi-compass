import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const radarData = [
  { subject: '내구성', value: 95 },
  { subject: '공간활용', value: 90 },
  { subject: '친환경성', value: 88 },
  { subject: '디자인', value: 85 },
  { subject: '조달신뢰도', value: 98 },
];

export const HeroSection = () => {
  return (
    <section id="hero" className="pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in">
          <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full mb-6 uppercase tracking-widest">
            Interactive Identity
          </div>
          <div className="space-y-2 mb-10">
            <div className="flex items-baseline space-x-4">
              <span className="ggi-letter">G</span>
              <span className="text-2xl md:text-3xl font-bold text-muted-foreground">Global Standard</span>
            </div>
            <div className="flex items-baseline space-x-4">
              <span className="ggi-letter">G</span>
              <span className="text-2xl md:text-3xl font-bold text-muted-foreground">Great Design</span>
            </div>
            <div className="flex items-baseline space-x-4">
              <span className="ggi-letter">I</span>
              <span className="text-2xl md:text-3xl font-bold text-muted-foreground">Infrastructure</span>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            G.G.I는 단순한 약자를 넘어 우리가 추구하는 세 가지 가치를 증명합니다.<br />
            <span className="font-bold text-primary">전 세계적인 표준</span>을 준수하며, <span className="font-bold text-primary">위대한 디자인</span>으로 교육 <span className="font-bold text-primary">인프라</span>의 혁신을 선도합니다.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-card p-4 rounded-xl shadow-md border-l-4 border-accent">
              <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Status</p>
              <p className="font-black text-primary">나라장터 정식 등록</p>
            </div>
            <div className="bg-card p-4 rounded-xl shadow-md border-l-4 border-accent">
              <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Verification</p>
              <p className="font-black text-primary">여성기업 인증 완료</p>
            </div>
          </div>
        </div>
        <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="bg-primary rounded-3xl p-10 text-primary-foreground shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-xl font-bold mb-6">지지아이 핵심 성과 요약</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
                  />
                  <Radar
                    name="GGI Performance"
                    dataKey="value"
                    stroke="hsl(351, 97%, 43%)"
                    fill="hsl(351, 97%, 43%)"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-center mt-6 text-primary-foreground/50">* 자체 기술력 및 조달 성과 기반 지표</p>
          </div>
        </div>
      </div>
    </section>
  );
};
