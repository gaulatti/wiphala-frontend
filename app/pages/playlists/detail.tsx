import { ArrowLeftIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Box, Button, Card, Code, Dialog, Flex, Heading, ScrollArea } from '@radix-ui/themes';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState, type JSX } from 'react';
import { NavLink, useParams } from 'react-router';
import { Method, useAPI } from '~/clients/api';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '~/components/ui/breadcrumb';
import { Separator } from '~/components/ui/separator';
import { SidebarTrigger } from '~/components/ui/sidebar';
import { WorkflowGraph, type Slot } from '~/utils/workflows';
import type { Route } from './+types/detail';

/**
 * Generates metadata for the playlist details page.
 *
 * @param {} args - The metadata arguments provided by the route.
 * @returns An array of metadata objects, including the title for the page.
 */
export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Playlist Details - Wiphala" },
  ];
}

const PlaylistDetails = () => {
  return <>
    <div className='flex items-center mb-3 mt-1'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild style={{ lineHeight: '1rem' }}>
              <NavLink to={`/playlists`}>
                <Flex gap='3'>
                  <ArrowLeftIcon width="18" height="18" /> Back to Playlists
                </Flex>
              </NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div><Heading size='7'>Playlist Detail</Heading></>
}

const SlotDetails = ({ setCurrentNode, node }: { setCurrentNode: (key: number | null) => void, node: Slot }) => {
  return <>
    <div className='flex items-center mb-3 mt-1'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => setCurrentNode(null)} style={{ lineHeight: '1rem' }}>
              <Flex gap='3'>
                <ArrowLeftIcon width="18" height="18" /> Back to Playlist Details
              </Flex>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
    <Heading size='7' className='mb-4'>Slot: {node.name}</Heading>
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>View Slot Output</Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="90vw" maxHeight="90vh" size="4">
        <Flex direction="column" gap="3" width="100%" height="100%">
          <Flex direction="row" align="center" justify="between">
            <Dialog.Title>Slot Output: {node.name}</Dialog.Title>
            <Dialog.Close><Cross1Icon className='mb-3' /></Dialog.Close>
          </Flex>
          <ScrollArea type="always" scrollbars="vertical" style={{ height: '70vh' }}>
            <Code><pre style={{ maxWidth: '90vw', maxHeight: '90%' }}>{JSON.stringify(node, null, 2)}</pre></Code>
          </ScrollArea>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  </>
}


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
  const [currentNode, setCurrentNode] = useState<number | null>(null);

  const onNodeClick = useCallback((_: Event, node: { id: number }) => {
    setCurrentNode(node?.id)
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
        <Flex gap='3' className='h-full' direction={{ initial: 'column', lg: 'row' }}>
          <Box width={{ initial: '100%', lg: '50%' }} height={'100%'}>
            <Card className='h-full'>
              <ReactFlowProvider>
                <WorkflowGraph sequence={data?.context?.sequence} onNodeClick={onNodeClick} />
              </ReactFlowProvider>
            </Card>
          </Box>
          <Box width={{ initial: '100%', lg: '50%' }}>
            <Card className='h-full'>
              {currentNode ? <SlotDetails setCurrentNode={setCurrentNode} node={data?.context?.sequence.find((item: Slot) => item.id == currentNode)} /> : <PlaylistDetails />}
            </Card>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default PlaylistDetail;
