import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, FolderOpen, Folder } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  display_order: number;
  description?: string;
}

interface CategorySidebarProps {
  className?: string;
}

export const CategorySidebar = ({ className }: CategorySidebarProps) => {
  const { mainCategory, subCategory } = useParams<{ mainCategory: string; subCategory?: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Auto-expand the current category
    if (mainCategory && mainCategory !== 'all') {
      const mainCat = categories.find(c => c.slug === mainCategory && !c.parent_id);
      if (mainCat) {
        setExpandedCategories(prev => new Set([...prev, mainCat.id]));
      }
    }
  }, [mainCategory, categories]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (!error && data) {
      setCategories(data);
    }
  };

  const mainCategories = categories.filter(c => !c.parent_id);
  const getSubcategories = (parentId: string) => 
    categories.filter(c => c.parent_id === parentId);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const isActiveMain = (slug: string) => mainCategory === slug;
  const isActiveSub = (mainSlug: string, subSlug: string) => 
    mainCategory === mainSlug && subCategory === subSlug;

  return (
    <aside className={cn("bg-card rounded-xl p-4 shadow-sm", className)}>
      <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
        <FolderOpen className="h-5 w-5" />
        카테고리
      </h3>

      <nav className="space-y-1">
        {/* All Products Link */}
        <Link
          to="/product/all"
          className={cn(
            "block px-3 py-2 rounded-lg text-sm transition-colors",
            mainCategory === 'all' 
              ? "bg-primary text-primary-foreground font-medium"
              : "text-muted-foreground hover:text-primary hover:bg-muted"
          )}
        >
          전체 제품
        </Link>

        {/* Category Tree */}
        {mainCategories.map((mainCat) => {
          const subcats = getSubcategories(mainCat.id);
          const isExpanded = expandedCategories.has(mainCat.id);
          const isActive = isActiveMain(mainCat.slug);

          return (
            <div key={mainCat.id}>
              <div className="flex items-center">
                {subcats.length > 0 && (
                  <button
                    onClick={() => toggleCategory(mainCat.id)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                )}
                <Link
                  to={`/product/${mainCat.slug}`}
                  className={cn(
                    "flex-1 px-2 py-2 rounded-lg text-sm transition-colors flex items-center gap-2",
                    isActive && !subCategory
                      ? "bg-primary text-primary-foreground font-medium"
                      : isActive
                        ? "bg-accent/10 text-accent font-medium"
                        : "text-foreground hover:text-primary hover:bg-muted"
                  )}
                >
                  <Folder className="h-4 w-4" />
                  {mainCat.name}
                </Link>
              </div>

              {/* Subcategories */}
              {isExpanded && subcats.length > 0 && (
                <div className="ml-6 mt-1 space-y-1 border-l-2 border-border pl-3">
                  {subcats.map((subCat) => (
                    <Link
                      key={subCat.id}
                      to={`/product/${mainCat.slug}/${subCat.slug}`}
                      className={cn(
                        "block px-3 py-1.5 rounded-lg text-sm transition-colors",
                        isActiveSub(mainCat.slug, subCat.slug)
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:text-primary hover:bg-muted"
                      )}
                    >
                      {subCat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
