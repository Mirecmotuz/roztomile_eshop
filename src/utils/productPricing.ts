import type { Product } from '../types';

/**
 * Vráti jednotkovú cenu produktu podľa zvoleného variantu, ak je zapnutý prepínač cien.
 *
 * @example
 * // V katalógu: price ako základ, variants + enableVariantPriceSwitch + variantPrices
 * const p: Product = {
 *   price: 100,
 *   variants: ['malá', 'veľká'],
 *   enableVariantPriceSwitch: true,
 *   variantPrices: { malá: 90, 'veľká': 120 },
 *   // ...
 * };
 * getUnitPrice(p, 'veľká'); // 120
 * getUnitPrice(p, null);   // 100 (bez variantu → základná cena)
 */
export function getUnitPrice(
  product: Product,
  selectedVariant?: string | null,
): number {
  const variantKey = selectedVariant?.trim() ?? '';
  if (!product.enableVariantPriceSwitch || variantKey === '') {
    return product.price;
  }
  const variantPrice = product.variantPrices?.[variantKey];
  if (typeof variantPrice === 'number' && Number.isFinite(variantPrice)) {
    return variantPrice;
  }
  return product.price;
}
