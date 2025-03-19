import { NavLink, useParams } from 'react-router';
import { Method, useAPI } from '~/clients/api';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '~/components/ui/breadcrumb';
import { Separator } from '~/components/ui/separator';
import { SidebarTrigger } from '~/components/ui/sidebar';
import type { Route } from './+types/detail';

/**
 * Generates metadata for the "Strategy Details" page.
 *
 * @param {} args - The metadata arguments provided by the route.
 * @returns An array containing metadata objects, including the page title.
 */
export function meta({}: Route.MetaArgs) {
  return [{ title: 'Strategy Details - Wiphala' }];
}

const StrategyDetail = () => {
  const { slug } = useParams();
  const { data } = useAPI(Method.GET, [], `streategies/${slug}`);
  return <>
    <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className='hidden md:block'>
              <BreadcrumbLink asChild>
                <NavLink to={`/strategies`}>
                  Strategies
                </NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className='hidden md:block' />
            <BreadcrumbItem>
              <BreadcrumbPage>{slug}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </>;
};

export default StrategyDetail;
