import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { X, Upload, Image as ImageIcon, Star } from 'lucide-react';
import { toast } from 'sonner';
import { logError, getErrorMessage } from '@/lib/errorUtils';

interface ImageDropzoneProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const IMAGE_SLOT_LABELS = [
  { label: '대표 이미지', description: '목록 및 상단 노출용' },
  { label: '상세 이미지 1', description: '상세페이지 상단용' },
  { label: '상세 이미지 2', description: '상세페이지 하단용' },
];

const ImageDropzone = ({ images, onChange, maxImages = 3 }: ImageDropzoneProps) => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState<number | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('JPG, PNG, WebP, GIF 이미지만 업로드 가능합니다.');
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('이미지 크기는 5MB 이하여야 합니다.');
      return null;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSlotDrop = useCallback(async (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;

    setIsUploading(slotIndex);

    try {
      const url = await uploadFile(files[0]);
      if (url) {
        const newImages = [...images];
        // Fill empty slots before this one if needed
        while (newImages.length < slotIndex) {
          newImages.push('');
        }
        newImages[slotIndex] = url;
        onChange(newImages.filter(Boolean));
        toast.success('이미지가 업로드되었습니다.');
      }
    } catch (error: any) {
      logError('Image upload', error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsUploading(null);
    }
  }, [images, onChange]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(slotIndex);

    try {
      const url = await uploadFile(files[0]);
      if (url) {
        const newImages = [...images];
        while (newImages.length < slotIndex) {
          newImages.push('');
        }
        newImages[slotIndex] = url;
        onChange(newImages.filter(Boolean));
        toast.success('이미지가 업로드되었습니다.');
      }
    } catch (error: any) {
      logError('Image upload', error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsUploading(null);
      e.target.value = '';
    }
  }, [images, onChange]);

  const removeImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  }, [images, onChange]);

  const setAsMain = useCallback((index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const [moved] = newImages.splice(index, 1);
    newImages.unshift(moved);
    onChange(newImages);
    toast.success('대표 이미지가 변경되었습니다.');
  }, [images, onChange]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {IMAGE_SLOT_LABELS.map((slot, slotIndex) => {
          const imageUrl = images[slotIndex];
          const isMain = slotIndex === 0;
          const inputId = `image-upload-${slotIndex}`;

          return (
            <div key={slotIndex} className="space-y-2">
              {/* Slot Label */}
              <div className="flex items-center gap-2">
                {isMain && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                <span className={`text-sm font-medium ${isMain ? 'text-amber-600' : 'text-foreground'}`}>
                  {slot.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground -mt-1">{slot.description}</p>

              {/* Image Slot */}
              {imageUrl ? (
                <div
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                    isMain 
                      ? 'border-amber-400 ring-2 ring-amber-200' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt={slot.label}
                    className="w-full h-full object-cover"
                  />
                  {isMain && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      대표
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {!isMain && (
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7 bg-white/90 hover:bg-white shadow-sm"
                        onClick={() => setAsMain(slotIndex)}
                        title="대표 이미지로 설정"
                      >
                        <Star className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="h-7 w-7 shadow-sm"
                      onClick={() => removeImage(slotIndex)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOverIndex(slotIndex); }}
                  onDragLeave={() => setDragOverIndex(null)}
                  onDrop={(e) => handleSlotDrop(e, slotIndex)}
                  className={`aspect-[4/3] border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    dragOverIndex === slotIndex
                      ? 'border-primary bg-primary/5'
                      : isMain 
                        ? 'border-amber-300 bg-amber-50/50 hover:border-amber-400 hover:bg-amber-50'
                        : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => handleFileInput(e, slotIndex)}
                    className="hidden"
                    id={inputId}
                    disabled={isUploading !== null}
                  />
                  <label htmlFor={inputId} className="cursor-pointer flex flex-col items-center gap-2 p-4">
                    {isUploading === slotIndex ? (
                      <>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        <span className="text-xs text-muted-foreground">업로드 중...</span>
                      </>
                    ) : (
                      <>
                        <div className={`p-2 rounded-full ${isMain ? 'bg-amber-100' : 'bg-muted'}`}>
                          <ImageIcon className={`h-5 w-5 ${isMain ? 'text-amber-600' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="text-center">
                          <span className="text-xs text-primary font-medium block">클릭 또는</span>
                          <span className="text-xs text-muted-foreground">드래그 앤 드롭</span>
                        </div>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        JPG, PNG, WebP, GIF / 각 5MB 이하 • 첫 번째 이미지가 목록에서 대표로 표시됩니다
      </p>
    </div>
  );
};

export default ImageDropzone;
