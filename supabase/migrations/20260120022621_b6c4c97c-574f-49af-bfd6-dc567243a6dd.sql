-- Add new fields to products table for the detailed product information
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS procurement_id text,
ADD COLUMN IF NOT EXISTS price text,
ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- Add image_url column to categories for category thumbnails
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS description text;

-- Clear existing categories to set up new structure
DELETE FROM public.categories;

-- Insert main categories (대분류)
INSERT INTO public.categories (name, slug, parent_id, display_order, is_active, description) VALUES
('교육용 가구', 'educational', NULL, 1, true, 'Educational Furniture - 학교 및 교육 기관을 위한 맞춤형 가구'),
('사무용 가구', 'office', NULL, 2, true, 'Office Furniture - 업무 효율성을 극대화하는 사무 가구'),
('오피스 체어', 'chairs', NULL, 3, true, 'Office Chairs - 인체공학적 설계의 프리미엄 의자');

-- Insert subcategories for 교육용 가구 (Educational Furniture)
INSERT INTO public.categories (name, slug, parent_id, display_order, is_active, description)
SELECT '칠판보조장', 'blackboard-cabinet', id, 1, true, '효율적인 수납과 슬라이딩 시스템으로 교실 정면의 완성도를 높이는 프리미엄 칠판보조장'
FROM public.categories WHERE slug = 'educational';

INSERT INTO public.categories (name, slug, parent_id, display_order, is_active, description)
SELECT '사물함', 'lockers', id, 2, true, '학생들의 소지품을 안전하게 보관할 수 있는 견고한 사물함'
FROM public.categories WHERE slug = 'educational';

INSERT INTO public.categories (name, slug, parent_id, display_order, is_active, description)
SELECT '수강용 테이블', 'lecture-table', id, 3, true, '강의실 및 교육 환경에 최적화된 수강용 테이블'
FROM public.categories WHERE slug = 'educational';

INSERT INTO public.categories (name, slug, parent_id, display_order, is_active, description)
SELECT '강연대', 'podium', id, 4, true, '발표와 강연을 위한 전문 강연대'
FROM public.categories WHERE slug = 'educational';

-- Insert subcategories for 사무용 가구 (Office Furniture)
INSERT INTO public.categories (name, slug, parent_id, display_order, is_active, description)
SELECT '책상', 'desk', id, 1, true, '업무 효율을 높이는 다양한 사무용 책상'
FROM public.categories WHERE slug = 'office';

INSERT INTO public.categories (name, slug, parent_id, display_order, is_active, description)
SELECT '서랍', 'drawer', id, 2, true, '문서와 사무용품을 정리할 수 있는 서랍장'
FROM public.categories WHERE slug = 'office';

INSERT INTO public.categories (name, slug, parent_id, display_order, is_active, description)
SELECT '캐비닛', 'cabinet', id, 3, true, '사무실 수납을 위한 다용도 캐비닛'
FROM public.categories WHERE slug = 'office';

-- Insert subcategories for 오피스 체어 (Office Chairs)
INSERT INTO public.categories (name, slug, parent_id, display_order, is_active, description)
SELECT '중역용 의자', 'executive-chair', id, 1, true, '품격있는 중역실을 위한 프리미엄 의자'
FROM public.categories WHERE slug = 'chairs';

INSERT INTO public.categories (name, slug, parent_id, display_order, is_active, description)
SELECT '사무용 의자', 'office-chair', id, 2, true, '장시간 업무에도 편안한 사무용 의자'
FROM public.categories WHERE slug = 'chairs';

INSERT INTO public.categories (name, slug, parent_id, display_order, is_active, description)
SELECT '회의용 의자', 'meeting-chair', id, 3, true, '회의실을 위한 세련된 디자인의 의자'
FROM public.categories WHERE slug = 'chairs';

INSERT INTO public.categories (name, slug, parent_id, display_order, is_active, description)
SELECT '라운지용 의자', 'lounge-chair', id, 4, true, '휴게 공간을 위한 편안한 라운지 의자'
FROM public.categories WHERE slug = 'chairs';