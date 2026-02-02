import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// PDF 파일 URL - 실제 카탈로그 PDF URL로 교체해주세요
const CATALOG_PDF_URL = '/catalog.pdf';

interface CatalogDownloadButtonProps {
  variant?: 'hero' | 'fixed';
  className?: string;
}

export const CatalogDownloadButton = ({ 
  variant = 'hero', 
  className = '' 
}: CatalogDownloadButtonProps) => {
  
  const handleDownload = async () => {
    try {
      // Track the download
      await supabase.from('catalog_downloads').insert({
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to track catalog download:', error);
    }
    
    // Open PDF in new tab
    window.open(CATALOG_PDF_URL, '_blank');
    toast.success('카탈로그가 새 탭에서 열립니다.');
  };

  if (variant === 'fixed') {
    return (
      <button
        onClick={handleDownload}
        className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105 md:hidden ${className}`}
        aria-label="카탈로그 다운로드"
      >
        <Download className="w-5 h-5" />
        <span className="text-sm font-semibold">카탈로그</span>
      </button>
    );
  }

  return (
    <Button
      size="lg"
      onClick={handleDownload}
      className={`bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/40 font-bold px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base shadow-lg w-full sm:w-auto justify-center ${className}`}
    >
      <Download className="w-5 h-5 mr-2 flex-shrink-0" />
      <span>카탈로그 다운로드</span>
    </Button>
  );
};
