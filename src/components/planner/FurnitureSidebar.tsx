import { useState } from 'react';
import { Monitor, Armchair, Archive, Square, BookOpen, Sofa, Loader2, FlaskConical, UtensilsCrossed, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FurnitureItem } from '@/types/planner';
import { usePlannerCategories, usePlannerProducts } from '@/hooks/usePlannerProducts';

interface FurnitureSidebarProps {
  onDragStart: (furniture: FurnitureItem) => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  educational: BookOpen,
  office: Monitor,
  chairs: Armchair,
  'dining-table': UtensilsCrossed,
  'lab-bench': FlaskConical,
  military: Shield,
  // fallback
  desk: Monitor,
  chair: Armchair,
  storage: Archive,
  table: Square,
  sofa: Sofa,
  shelf: BookOpen,
};

export const FurnitureSidebar = ({ onDragStart }: FurnitureSidebarProps) => {
  const { data: categories, isLoading: catLoading } = usePlannerCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const { data: products, isLoading: prodLoading } = usePlannerProducts(selectedCategoryId);

  // Auto-select first category when loaded
  if (categories && categories.length > 0 && !selectedCategoryId) {
    setSelectedCategoryId(categories[0].id);
  }

  const handleDragStart = (e: React.DragEvent, furniture: FurnitureItem) => {
    e.dataTransfer.setData('furniture', JSON.stringify(furniture));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(furniture);
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      {/* Category Icons */}
      <div className="p-3 border-b border-border">
        <h2 className="text-sm font-bold text-primary mb-3">제품 카테고리</h2>
        {catLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {(categories || []).map((cat) => {
              const Icon = categoryIcons[cat.slug] || Archive;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                    "hover:bg-accent/20",
                    selectedCategoryId === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium leading-tight text-center">{cat.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Furniture List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {prodLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (products || []).length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">
              이 카테고리에 등록된 제품이 없습니다
            </p>
          ) : (
            (products || []).map((furniture) => (
              <div
                key={furniture.id}
                draggable
                onDragStart={(e) => handleDragStart(e, furniture)}
                className={cn(
                  "group cursor-grab active:cursor-grabbing",
                  "bg-background border border-border rounded-lg p-3",
                  "hover:border-primary hover:shadow-md transition-all"
                )}
              >
                {furniture.thumbnail ? (
                  <img
                    src={furniture.thumbnail}
                    alt={furniture.name}
                    className="w-full aspect-[4/3] rounded mb-2 object-cover bg-muted"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="w-full aspect-[4/3] rounded mb-2 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: furniture.color || 'hsl(var(--muted))' }}
                  >
                    <div
                      className="border-2 border-foreground/30 rounded-sm"
                      style={{
                        width: `${Math.min(80, (furniture.width / 20))}%`,
                        height: `${Math.min(80, (furniture.height / 15))}%`,
                        backgroundColor: furniture.color,
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
                      }}
                    />
                  </div>
                )}
                <h3 className="font-semibold text-sm text-foreground truncate">
                  {furniture.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {furniture.width} × {furniture.height} mm
                </p>
                {furniture.price > 0 && (
                  <p className="text-sm font-bold text-accent mt-1">
                    ₩{furniture.price.toLocaleString()}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
