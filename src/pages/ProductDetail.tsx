import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, Mail, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  badges: string[] | null;
  features: string[] | null;
  specs: Record<string, any> | null;
  main_category: string | null;
  subcategory: string | null;
  procurement_id: string | null;
  price: string | null;
}

const ProductDetail = () => {
  const { productId, productSlug } = useParams<{ productId?: string; productSlug?: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const slug = productSlug || productId;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        setProduct(data as Product);
      }
      setIsLoading(false);
    };

    fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">제품을 찾을 수 없습니다</h1>
          <Link to="/product/all">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              제품 목록으로 돌아가기
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const specs = product.specs as Record<string, string> | null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary">홈</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/product/all" className="hover:text-primary">제품</Link>
            {product.main_category && (
              <>
                <ChevronRight className="h-4 w-4" />
                <Link to={`/product/${product.main_category}`} className="hover:text-primary">
                  {product.main_category}
                </Link>
              </>
            )}
            <ChevronRight className="h-4 w-4" />
            <span className="text-primary font-medium">{product.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={product.image_url || '/placeholder.svg'}
                alt={product.title}
                className="w-full h-full object-cover aspect-[4/3]"
                onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
              />
            </div>

            {/* Product Info */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {product.badges?.map((badge) => (
                  <Badge key={badge} variant="secondary" className="bg-accent/10 text-accent border-0 font-medium">
                    {badge}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-4xl font-black text-primary mb-4">{product.title}</h1>
              
              {/* Procurement ID & Price */}
              {(product.procurement_id || product.price) && (
                <div className="bg-muted/50 rounded-lg p-4 mb-6 space-y-2">
                  {product.procurement_id && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-primary">조달식별번호:</span>
                      <span className="text-sm text-muted-foreground">{product.procurement_id}</span>
                    </div>
                  )}
                  {product.price && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-primary">가격:</span>
                      <span className="text-lg font-bold text-accent">{product.price}원</span>
                    </div>
                  )}
                </div>
              )}

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Specs */}
              {specs && Object.keys(specs).length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-primary mb-4">제품 사양</h2>
                  <div className="bg-muted/50 rounded-xl p-6 space-y-3">
                    {Object.entries(specs).map(([key, value]) => (
                      <div key={key} className="flex">
                        <span className="font-medium text-primary w-28">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-primary mb-4">주요 특징</h2>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contact CTA */}
              <div className="bg-primary/5 rounded-xl p-6">
                <h3 className="text-lg font-bold text-primary mb-3">견적 및 문의</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  제품에 대한 자세한 견적이나 문의사항이 있으시면 연락주세요.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Phone className="mr-2 h-4 w-4" />
                    전화 문의
                  </Button>
                  <Button variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    이메일 문의
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
