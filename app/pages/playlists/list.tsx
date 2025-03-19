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
  return [{ title: 'Playlists - Wiphala' }];
}

/**
 * The `PlaylistsList` component renders a page layout for displaying a list of playlists.
 *
 * This component includes:
 * - A header with a sidebar trigger, a vertical separator, and a breadcrumb navigation.
 * - A `DataTable` component for displaying the playlist data.
 *
 * The header is styled with a responsive design, adapting its height and layout based on
 * the presence of certain CSS classes (e.g., `group-has-data-[collapsible=icon]/sidebar-wrapper`).
 *
 * @returns A JSX element representing the playlists list page.
 */
const PlaylistsList = () => {
  return (
    <>
      <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
        <div className='flex items-center gap-2 px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href='#'>Playlists</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <DataTable />
    </>
  );
};

export default PlaylistsList;
