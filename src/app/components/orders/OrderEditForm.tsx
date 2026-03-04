'use client';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Page, Layout, Card, Button, TextField, Checkbox,
         Banner, BlockStack, InlineStack, Thumbnail, Text, Divider } from '@shopify/polaris';
import { useOrderEdit } from '@/hooks/useOrderEdit';

const editSchema = z.object({
  lineItems: z.array(z.object({
    id:              z.string(),
    quantity:        z.number().min(0),
    discountPercent: z.number().min(0).max(100).optional(),
  })),
  notifyCustomer: z.boolean(),
  staffNote:      z.string().optional(),
});

export function OrderEditForm({ order }: { order: ShopifyOrder }) {
  const { mutate: applyEdit, isPending, isSuccess } = useOrderEdit(order.id);

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: {
      lineItems: order.lineItems.nodes.map(item => ({
        id:       item.id,
        quantity: item.currentQuantity,
        discountPercent: 0,
      })),
      notifyCustomer: true,
      staffNote: '',
    },
  });

  const { fields } = useFieldArray({ control, name: 'lineItems' });

  return (
    <Page
      title={`Edit Order ${order.name}`}
      backAction={{ content: 'Orders', url: '/orders' }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Line Items</Text>
              {fields.map((field, index) => {
                const item = order.lineItems.nodes[index];
                return (
                  <InlineStack key={field.id} gap="400" align="start" blockAlign="center">
                    <Thumbnail source={item.image?.url} alt={item.title} />
                    <BlockStack gap="100">
                      <Text as="p" fontWeight="semibold">{item.title}</Text>
                      <Text as="p" tone="subdued">{item.variant?.title}</Text>
                    </BlockStack>
                    <TextField
                      type="number"
                      label="Qty"
                      min="0"
                      {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })}
                      autoComplete="off"
                    />
                    <TextField
                      type="number"
                      label="Discount %"
                      min="0" max="100"
                      suffix="%"
                      {...register(`lineItems.${index}.discountPercent`, { valueAsNumber: true })}
                      autoComplete="off"
                    />
                  </InlineStack>
                );
              })}
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Edit Options</Text>
              <TextField label="Staff note" multiline={3} {...register('staffNote')} autoComplete="off"/>
              <Checkbox label="Notify customer" {...register('notifyCustomer')} />
              <Divider />
              <Button
                variant="primary"
                fullWidth
                loading={isPending}
                onClick={handleSubmit((data) => applyEdit(data))}
              >
                Apply Edit
              </Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}