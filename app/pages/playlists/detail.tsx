import { Box, Card, Flex, Heading } from '@radix-ui/themes';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, type JSX } from 'react';
import { NavLink, useParams } from 'react-router';
import { Method, useAPI } from '~/clients/api';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '~/components/ui/breadcrumb';
import { Separator } from '~/components/ui/separator';
import { SidebarTrigger } from '~/components/ui/sidebar';
import { WorkflowGraph } from '~/utils/workflows';

/**
 * PlaylistDetail component renders the detailed view of a playlist.
 *
 * This component utilizes the `useParams` hook to extract the `slug` parameter
 * from the URL and fetches the playlist data using the `useAPI` hook. It displays
 * a breadcrumb navigation, a workflow graph, and additional details about the playlist.
 *
 * @returns {JSX.Element} The rendered JSX element for the playlist detail page.
 *
 * Features:
 * - Breadcrumb navigation for easy navigation between playlists and strategies.
 * - A workflow graph visualizing the playlist's sequence using `WorkflowGraph`.
 * - A details section for additional playlist information.
 *
 * Dependencies:
 * - `useParams` for extracting URL parameters.
 * - `useAPI` for fetching playlist data.
 * - `ReactFlowProvider` for managing the workflow graph context.
 * - Components like `SidebarTrigger`, `Breadcrumb`, `Flex`, `Box`, `Card`, and `Heading`.
 */
const PlaylistDetail = (): JSX.Element => {
  const { slug } = useParams();
  const { data } = useAPI(Method.GET, [], `playlists/${slug}`);

  const onNodeClick = useCallback((event, node) => {
    console.log({ event, node })
  }, [])

  return (
    <>
      <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
        <div className='flex items-center gap-2 px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink asChild>
                  <NavLink to={`/playlists`}>Playlists</NavLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='hidden md:block' />
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink asChild>
                  <NavLink to={`/strategies/strategy`}>Strategy</NavLink>
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
      <Flex gap='3' direction={'column'} className='m-4' height={'100%'}>
        <Box className='mb-4'>
          <Heading size='7'>Playlist Detail</Heading>
        </Box>
        <Flex gap='3' className='h-full' direction={{ initial: 'column', lg: 'row' }}>
          <Box width={{ initial: '100%', lg: '50%' }} height={'100%'}>
            <Card className='h-full'>
              <ReactFlowProvider>
                <WorkflowGraph sequence={data?.context?.sequence} onNodeClick={onNodeClick} />
              </ReactFlowProvider>
            </Card>
          </Box>
          <Box width={{ initial: '100%', lg: '50%' }}>
            <Card className='h-full'>Details</Card>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default PlaylistDetail;
