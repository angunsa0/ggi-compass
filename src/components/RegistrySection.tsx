import { Shield, Award, Leaf, Handshake } from 'lucide-react';

const certifications = [
  { icon: Shield, label: '여성기업 인증' },
  { icon: Award, label: 'KS 표준 준수' },
  { icon: Leaf, label: '친환경 소재인증' },
  { icon: Handshake, label: '중소기업 확인' },
];

export const RegistrySection = () => {
  return (
    <section id="registry" className="py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-primary mb-2 uppercase italic">Registry & Verified</h2>
            <p className="text-muted-foreground">지지아이는 검증된 프로세스를 통해 조달 시장에 참여합니다.</p>
          </div>
          <div className="flex space-x-6">
            <div className="h-10 px-4 py-2 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground hover:text-primary hover:bg-secondary transition-all cursor-pointer">
              나라장터
            </div>
            <div className="h-10 px-4 py-2 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground hover:text-primary hover:bg-secondary transition-all cursor-pointer">
              학교장터
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.label}
              className="p-6 bg-card border border-border rounded-xl text-center group hover:border-accent transition-all cursor-pointer"
            >
              <cert.icon className="w-8 h-8 mx-auto text-muted-foreground group-hover:text-accent mb-4 transition-colors" />
              <h5 className="font-bold text-sm">{cert.label}</h5>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
