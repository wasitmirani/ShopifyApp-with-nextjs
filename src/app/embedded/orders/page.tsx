'use client';
import { Page, Card, IndexTable, Badge, Button, Filters, TextField } from '@shopify/polaris';
import { useRouter } from 'next/navigation';
import { useOrders } from '@/hooks/useOrders';
import { useState } from 'react';

export default function OrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { orders, isLoading, hasNextPage, fetchNextPage } = useOrders({ search });

  const statusBadge = (status: string) => ({
    open:      <Badge tone="info">Open</Badge>,
    fulfilled: <Badge tone="success">Fulfilled</Badge>,
    cancelled: <Badge tone="critical">Cancelled</Badge>,
  }[status] ?? <Badge>{status}</Badge>);

  return (
    <Page title="Orders" subtitle="Manage and edit customer orders">
      <Card>
        <Filters
          queryValue={search}
          onQueryChange={setSearch}
          onQueryClear={() => setSearch('')}
          filters={[]}
        />
        <IndexTable
          resourceName={{ singular: 'order', plural: 'orders' }}
          itemCount={orders.length}
          loading={isLoading}
          headings={[
            { title: 'Order' }, { title: 'Customer' },
            { title: 'Total' },  { title: 'Status' },
            { title: 'Date' },   { title: 'Actions' },
          ]}
        >
          {orders.map((order) => (
            <IndexTable.Row key={order.id} id={order.id}>
              <IndexTable.Cell>{order.name}</IndexTable.Cell>
              <IndexTable.Cell>{order.customer?.displayName}</IndexTable.Cell>
              <IndexTable.Cell>{order.totalPrice}</IndexTable.Cell>
              <IndexTable.Cell>{statusBadge(order.displayFulfillmentStatus.toLowerCase())}</IndexTable.Cell>
              <IndexTable.Cell>{new Date(order.createdAt).toLocaleDateString()}</IndexTable.Cell>
              <IndexTable.Cell>
                <Button
                  size="slim"
                  disabled={order.displayFulfillmentStatus === 'FULFILLED'}
                  onClick={() => router.push(`/orders/${encodeURIComponent(order.id)}/edit`)}
                >
                  Edit Order
                </Button>
              </IndexTable.Cell>
            </IndexTable.Row>
          ))}
        </IndexTable>
      </Card>
    </Page>
  );
}