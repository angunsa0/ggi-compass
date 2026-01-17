import { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export const Footer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <footer id="contact" className="bg-primary text-primary-foreground py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-4xl font-black mb-6">G.G.I</h2>
          <p className="text-primary-foreground/60 mb-8 max-w-sm">
            주식회사 지지아이는 내실 있는 인프라 구축을 통해 대한민국 교육 현장의 미래를 설계합니다.
          </p>
          <div className="space-y-4 text-sm">
            <p className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-accent" />
              경기도 소재 본사 및 제조센터
            </p>
            <p className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-accent" />
              031-000-0000
            </p>
            <p className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-accent" />
              ggi_official@ggi.co.kr
            </p>
          </div>
        </div>
        <div className="bg-primary-foreground/5 p-8 rounded-2xl border border-primary-foreground/10">
          <h4 className="font-bold mb-6 text-accent">나라장터 식별번호 및 제품 문의</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="기관명/담당자 성함"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/30 focus:border-accent"
            />
            <Input
              type="email"
              placeholder="이메일 주소"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/30 focus:border-accent"
            />
            <Textarea
              placeholder="문의 내용을 입력하세요"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground h-32 placeholder:text-primary-foreground/30 focus:border-accent resize-none"
            />
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 font-bold shadow-lg"
            >
              문의 접수하기
            </Button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-primary-foreground/10 text-center text-primary-foreground/40 text-[10px] uppercase tracking-widest">
        &copy; 2024 G.G.I Infrastructure All Rights Reserved.
      </div>
    </footer>
  );
};
