import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  specs: string | null;
  procurement_id: string | null;
  price: string | null;
}

export const ProductCard = ({
  slug,
  title,
  description,
  image_url,
  specs,
  procurement_id,
  price,
}: ProductCardProps) => {
  // specs is now a plain string (규격 field)
  const dimensions = specs || null;

  // Format price with commas
  const formatPrice = (priceStr: string | null) => {
    if (!priceStr) return null;
    // Remove non-numeric characters except for the number itself
    const numericPrice = priceStr.replace(/[^0-9]/g, '');
    if (!numericPrice) return priceStr;
    return Number(numericPrice).toLocaleString('ko-KR') + '원';
  };

  return (
    <Link
      to={`/product/detail/${slug}`}
      className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] flex flex-col"
    >
      {/* Product Image - Square ratio with white background */}
      <div className="aspect-square overflow-hidden bg-white flex items-center justify-center p-4">
        <img
          src={image_url || '/placeholder.svg'}
          alt={title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        {/* Product Name */}
        <p className="font-bold text-base md:text-lg text-primary group-hover:underline line-clamp-1 mb-1">
          {title}
        </p>

        {/* Dimensions/Specs */}
        {dimensions && (
          <p className="text-xs md:text-sm text-muted-foreground mb-2 line-clamp-2 whitespace-pre-line">
            {dimensions}
          </p>
        )}

        {/* Dimensions/Specs */}
        {dimensions && (
          <p className="text-xs md:text-sm text-muted-foreground mb-2 line-clamp-1">
            {dimensions}
          </p>
        )}

        {/* Spacer to push bottom content down */}
        <div className="flex-1 min-h-2" />

        {/* Bottom Section: Procurement ID & Price */}
        <div className="mt-auto pt-3 border-t border-border/50">
          {/* Procurement ID */}
          {procurement_id && (
            <p className="text-xs text-muted-foreground/70 mb-2 font-mono">
              조달식별번호: {procurement_id}
            </p>
          )}

          {/* Price - Accent Color */}
          {price && (
            <p className="text-right text-base md:text-lg font-bold text-accent">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
