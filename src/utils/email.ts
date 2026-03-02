import emailjs from '@emailjs/browser';
import { Order } from '../types';
import { config } from '../config';

export const STORE_IBAN = config.store.iban;

const formatItems = (order: Order): string =>
  order.items
    .map(
      (i) =>
        `${i.product.name} × ${i.quantity} = ${(i.product.price * i.quantity).toFixed(2)} €`
    )
    .join('\n');

export async function sendOrderEmails(order: Order): Promise<void> {
  const commonParams = {
    variable_symbol: order.variableSymbol,
    order_id: order.id,
    total_amount: order.totalAmount.toFixed(2).replace('.', ','),
    items_list: formatItems(order),
    customer_name: `${order.formData.firstName} ${order.formData.lastName}`,
    customer_email: order.formData.email,
    customer_phone: order.formData.phone,
    note: order.formData.note || '—',
    packeta_point_name: order.formData.packetaPoint?.name ?? '—',
    packeta_point_address: order.formData.packetaPoint?.address ?? '—',
    packeta_point_id: order.formData.packetaPoint?.id ?? '—',
    iban: config.store.iban,
    created_at: new Intl.DateTimeFormat('sk-SK', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(order.createdAt),
  };

  await Promise.all([
    // Email to store owner
    emailjs.send(
      config.emailjs.serviceId,
      config.emailjs.ownerTemplateId,
      { ...commonParams, to_email: config.store.ownerEmail },
      config.emailjs.publicKey
    ),
    // Email to customer
    emailjs.send(
      config.emailjs.serviceId,
      config.emailjs.customerTemplateId,
      { ...commonParams, to_email: order.formData.email },
      config.emailjs.publicKey
    ),
  ]);
}
