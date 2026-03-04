import { AppBridgeProvider } from '@/components/providers/AppBridgeProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { Frame, Navigation } from '@shopify/polaris';
import { OrdersMinor, AnalyticsMinor, BillingStatementDollarMinor } from '@shopify/polaris-icons';

export default function EmbeddedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppBridgeProvider>
      <QueryProvider>
        <Frame
          navigation={
            <Navigation location="/">
              <Navigation.Section
                items={[
                  { url: '/orders',    label: 'Orders',    icon: OrdersMinor },
                  { url: '/audit',     label: 'Audit Log', icon: AnalyticsMinor },
                  { url: '/plans',     label: 'Plans',     icon: BillingStatementDollarMinor },
                ]}
              />
            </Navigation>
          }
        >
          {children}
        </Frame>
      </QueryProvider>
    </AppBridgeProvider>
  );
}