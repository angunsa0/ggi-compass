import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Product = Tables<'products'>;

const ProductList = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryTitle, setCategoryTitle] = useState('');

  // Map slug to category info
  const categoryMap: Record<string, { title: string; filter?: string }> = {
    'blackboard-cabinet': { title: '칠판보조장', filter: 'blackboard-cabinet' },
    'workstation': { title: '워크스테이션', filter: 'workstation' },
    'office-chair': { title: '오피스체어', filter: 'office-chair' },
    'cafeteria-furniture': { title: '식당가구', filter: 'cafeteria-furniture' },
    'all': { title: '전체 제품' },
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      
      const category = categorySlug ? categoryMap[categorySlug] : null;
      setCategoryTitle(category?.title || '전체 제품');

      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      // If specific category, filter by slug pattern or category field
      if (categorySlug && categorySlug !== 'all' && category?.filter) {
        query = query.or(`slug.ilike.%${category.filter}%,category.ilike.%${category.title}%`);
      }

      const { data, error } = await query;

      if (!error && data) {
        setProducts(data);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, [categorySlug]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Link to="/#products" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            제품 카테고리로 돌아가기
          </Link>

          <div className="mb-12">
            <h1 className="text-4xl font-black text-primary mb-4">{categoryTitle}</h1>
            <p className="text-muted-foreground">
              {products.length}개의 제품이 있습니다
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">로딩 중...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">등록된 제품이 없습니다.</p>
              <Link to="/#products">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  돌아가기
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <Link
                  key={product.id}
                  to={`/products/detail/${product.slug}`}
                  className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={product.image_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.badges?.slice(0, 2).map((badge) => (
                        <Badge
                          key={badge}
                          variant="secondary"
                          className="bg-accent/10 text-accent border-0 font-medium text-xs"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-primary font-medium group-hover:text-accent transition-colors">
                      상세 보기
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductList;
