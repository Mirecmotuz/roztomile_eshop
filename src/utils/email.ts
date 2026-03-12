import type { Order } from '../types';

const PICKUP_ADDRESS = 'Vodičkova 677/10, Praha 1';

export function formatItems(order: Order): string {
  return (order.items || [])
    .map((i) => {
      const name = i.variant ? `${i.product.name} (${i.variant})` : i.product.name;
      return `${name} × ${i.quantity} = ${(i.product.price * i.quantity).toFixed(2)} Kč`;
    })
    .join('\n');
}

export function buildCommonEmailParams(order: Order) {
  const delivery_method =
    order.formData.deliveryMethod === 'pickup'
      ? 'Osobní odběr'
      : 'Packeta — výdejní místo';

  const delivery_address =
    order.formData.deliveryMethod === 'pickup' ? PICKUP_ADDRESS : '—';

  return {
    variable_symbol: order.variableSymbol,
    order_id: order.id,
    total_amount: Number(order.totalAmount || 0).toFixed(2).replace('.', ','),
    items_list: formatItems(order),
    customer_name: `${order.formData.firstName} ${order.formData.lastName}`,
    customer_email: order.formData.email,
    customer_phone: order.formData.phone,
    note: order.formData.note || '—',
    packeta_point_name: order.formData.packetaPoint?.name || '—',
    packeta_point_address: order.formData.packetaPoint?.address || '—',
    packeta_point_id: order.formData.packetaPoint?.id || '—',
    delivery_method,
    delivery_address,
  };
}

