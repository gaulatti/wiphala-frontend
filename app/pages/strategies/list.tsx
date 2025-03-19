import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '~/components/ui/breadcrumb';
import { Separator } from '~/components/ui/separator';
import { SidebarTrigger } from '~/components/ui/sidebar';
import { DataTable } from './list.table';
import type { Route } from './+types/list';

/**
 * Generates metadata for the playlists list page.
 *
 * @param {} args - The metadata arguments (currently unused).
 * @returns An array containing metadata objects, including the page title.
 */
export function meta({}: Route.MetaArgs) {
  return [{ title: 'Strategies - Wiphala' }];
}

/**
 * The `StrategiesList` component renders a page layout for displaying a list of strategies.
 * It includes a header with a sidebar trigger, a breadcrumb navigation, and a data table.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered JSX element for the strategies list page.
 *
 * @remarks
 * - The header contains a sidebar trigger button, a vertical separator, and breadcrumb navigation.
 * - The `DataTable` component is used to display the list of strategies.
 * - The layout is styled with utility classes for responsive design and transitions.
 *
 * @example
 * ```tsx
 * import StrategiesList from './strategies/list';
 *
 * const App = () => {
 *   return <StrategiesList />;
 * };
 * ```
 */
const StrategiesList = () => {
  return (
    <>
      <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
        <div className='flex items-center gap-2 px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href='#'>Strategies</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <DataTable />
    </>
  );
};

export default StrategiesList;
