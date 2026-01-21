import { Badge } from '@/components/ui/badge';

interface ProductInfoTableProps {
  modelName: string | null;
  title: string;
  specs: string | null;
  procurementId: string | null;
  price: string | null;
  badges?: string[] | null;
}

// Format price with commas and 원 suffix
const formatPrice = (priceStr: string | null): string => {
  if (!priceStr) return '가격 문의';
  const numericPrice = priceStr.replace(/[^0-9]/g, '');
  if (!numericPrice) return priceStr;
  return Number(numericPrice).toLocaleString('ko-KR') + '원';
};

export const ProductInfoTable = ({
  modelName,
  title,
  specs,
  procurementId,
  price,
  badges,
}: ProductInfoTableProps) => {
  return (
    <div className="space-y-6">
      {/* Badges */}
      {badges && badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <Badge 
              key={badge} 
              variant="secondary" 
              className="bg-accent/10 text-accent border-0 font-medium"
            >
              {badge}
            </Badge>
          ))}
        </div>
      )}

      {/* Model Name - Most Prominent */}
      {modelName && (
        <h1 className="text-3xl md:text-4xl font-black text-primary leading-tight">
          {modelName}
        </h1>
      )}

      {/* Product Title */}
      <h2 className={`font-bold text-foreground ${modelName ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl text-primary'}`}>
        {title}
      </h2>

      {/* Info Table */}
      <div className="bg-muted/50 rounded-xl overflow-hidden">
        <table className="w-full text-sm md:text-base">
          <tbody>
            {specs && (
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-semibold text-primary bg-muted/50 w-28 md:w-36 whitespace-nowrap">
                  규격
                </td>
                <td className="py-3 px-4 text-foreground whitespace-pre-wrap">
                  {specs}
                </td>
              </tr>
            )}
            {procurementId && (
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-semibold text-primary bg-muted/50 whitespace-nowrap">
                  조달식별번호
                </td>
                <td className="py-3 px-4 text-muted-foreground font-mono">
                  {procurementId}
                </td>
              </tr>
            )}
            <tr>
              <td className="py-3 px-4 font-semibold text-primary bg-muted/50 whitespace-nowrap">
                조달가격
              </td>
              <td className="py-3 px-4">
                <span className="text-lg md:text-xl font-bold text-accent">
                  {formatPrice(price)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
