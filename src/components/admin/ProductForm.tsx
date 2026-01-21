import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, X, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ImageDropzone from './ImageDropzone';

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
}

interface ProductFormData {
  slug: string;
  title: string;
  description: string;
  images: string[];
  image_url: string;
  badges: string;
  features: string;
  specs: string;
  main_category: string;
  subcategory: string;
  display_order: number;
  procurement_id: string;
  price: string;
}

interface ProductFormProps {
  formData: ProductFormData;
  categories: Category[];
  isEditing: boolean;
  onFormChange: (data: Partial<ProductFormData>) => void;
  onSave: () => void;
  onCancel: () => void;
}

// Format price with comma separators
const formatPrice = (value: string): string => {
  const numericValue = value.replace(/[^\d]/g, '');
  if (!numericValue) return '';
  return Number(numericValue).toLocaleString('ko-KR');
};

const ProductForm = ({
  formData,
  categories,
  isEditing,
  onFormChange,
  onSave,
  onCancel,
}: ProductFormProps) => {
  const mainCategories = categories.filter(c => !c.parent_id);
  const getSubcategories = (mainSlug: string) => {
    const main = mainCategories.find(c => c.slug === mainSlug);
    if (!main) return [];
    return categories.filter(c => c.parent_id === main.id);
  };

  const handleImagesChange = (images: string[]) => {
    onFormChange({ 
      images, 
      image_url: images[0] || '' 
    });
  };

  const handlePriceChange = (value: string) => {
    onFormChange({ price: formatPrice(value) });
  };

  // Validation
  const validation = useMemo(() => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = '품명은 필수 입력 항목입니다.';
    if (!formData.price.trim()) errors.price = '조달가격은 필수 입력 항목입니다.';
    return errors;
  }, [formData.title, formData.price]);

  const isValid = Object.keys(validation).length === 0;

  return (
    <div className="space-y-6 py-4">
      {/* Image Upload Section */}
      <Card className="border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            📸 제품 이미지
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImageDropzone
            images={formData.images}
            onChange={handleImagesChange}
            maxImages={3}
          />
        </CardContent>
      </Card>

      {/* Basic Info Group */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            📋 기본 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-1">
                품명 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => onFormChange({ title: e.target.value })}
                placeholder="제품의 전체 이름"
                className={validation.title ? 'border-destructive' : ''}
              />
              {validation.title && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validation.title}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">모델명 (URL 슬러그)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => onFormChange({ slug: e.target.value })}
                placeholder="product-model-name"
              />
              <p className="text-xs text-muted-foreground">영문, 숫자, 하이픈만 사용</p>
            </div>
          </div>

          {/* Category Selection */}
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="main_category">대분류</Label>
              <Select
                value={formData.main_category}
                onValueChange={(value) => onFormChange({ main_category: value, subcategory: '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="대분류 선택" />
                </SelectTrigger>
                <SelectContent>
                  {mainCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory">소분류</Label>
              <Select
                value={formData.subcategory}
                onValueChange={(value) => onFormChange({ subcategory: value })}
                disabled={!formData.main_category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="소분류 선택" />
                </SelectTrigger>
                <SelectContent>
                  {getSubcategories(formData.main_category).map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specifications Group */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            📐 상세 사양
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="specs">규격 (사이즈)</Label>
            <Textarea
              id="specs"
              value={formData.specs}
              onChange={(e) => onFormChange({ specs: e.target.value })}
              placeholder="W1200 x D600 x H750&#10;재질: 스틸 프레임, MDF 상판&#10;색상: 화이트, 그레이"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">규격, 재질, 색상 등 자유롭게 입력 가능</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="procurement_id">조달번호</Label>
              <Input
                id="procurement_id"
                value={formData.procurement_id}
                onChange={(e) => onFormChange({ procurement_id: e.target.value })}
                placeholder="12345678"
              />
              <p className="text-xs text-muted-foreground">G2B 등록번호</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="flex items-center gap-1">
                조달가격 <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="500,000"
                  className={`pr-8 ${validation.price ? 'border-destructive' : ''}`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  원
                </span>
              </div>
              {validation.price && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validation.price}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="badges">뱃지 (쉼표로 구분)</Label>
            <Input
              id="badges"
              value={formData.badges}
              onChange={(e) => onFormChange({ badges: e.target.value })}
              placeholder="MAS 등록, KS 인증, 친환경"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">표시 순서</Label>
            <Input
              id="display_order"
              type="number"
              value={formData.display_order}
              onChange={(e) => onFormChange({ display_order: Number(e.target.value) })}
              className="w-32"
            />
          </div>
        </CardContent>
      </Card>

      {/* Description Group */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            ✏️ 설명
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">제품 설명</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onFormChange({ description: e.target.value })}
              placeholder="제품에 대한 간단한 소개"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">주요 특징</Label>
            <Textarea
              id="features"
              value={formData.features}
              onChange={(e) => onFormChange({ features: e.target.value })}
              placeholder="• 특징 1&#10;• 특징 2&#10;• 특징 3"
              rows={5}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              줄바꿈으로 구분하여 입력하세요. 각 줄이 하나의 특징으로 표시됩니다.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t sticky bottom-0 bg-background pb-2">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          className="w-full sm:w-auto min-h-[44px]"
        >
          <X className="mr-2 h-4 w-4" />
          취소
        </Button>
        <Button 
          onClick={onSave} 
          className="w-full sm:w-auto min-h-[44px]"
          disabled={!isValid}
        >
          <Save className="mr-2 h-4 w-4" />
          {isEditing ? '수정 저장' : '제품 등록'}
        </Button>
      </div>

      {!isValid && (
        <p className="text-sm text-destructive text-center flex items-center justify-center gap-2">
          <AlertCircle className="h-4 w-4" />
          필수 항목을 모두 입력해 주세요.
        </p>
      )}
    </div>
  );
};

export default ProductForm;
