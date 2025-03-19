import { Button, Link } from '@radix-ui/themes';
import { type ColumnDef, flexRender, getCoreRowModel, type SortingState, useReactTable } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router';
import { Method, useAPI } from '~/clients/api';
import { PaginationControls } from '~/components/pagination-controls';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { useRandom } from '~/hooks/useRandom';
import { useSSE } from '~/hooks/useSSE';

/**
 * Represents a playlist with metadata and status information.
 *
 * @typedef Playlist
 * @property {string} slug - A unique identifier for the playlist.
 * @property {'CREATED' | 'RUNNING' | 'FAILED' | 'COMPLETE'} status - The current status of the playlist.
 * @property {number | null} current_slot - The current slot number in the playlist, or `null` if not applicable.
 * @property {{ slug: string; name: string }} strategy - The strategy associated with the playlist, including its slug and name.
 * @property {string} created_at - The timestamp when the playlist was created.
 * @property {string} updated_at - The timestamp when the playlist was last updated.
 * @property {Record<string, any>} context - Additional context or metadata associated with the playlist.
 */
export type Playlist = {
  slug: string;
  status: 'CREATED' | 'RUNNING' | 'FAILED' | 'COMPLETE';
  current_slot: number | null;
  strategy: { slug: string; name: string };
  created_at: string;
  updated_at: string;
  context: Record<string, any>;
};

/**
 * Defines the column configuration for a playlist table.
 * Each column specifies how data is accessed, displayed, and optionally formatted.
 *
 * Columns:
 * - **Slug**:
 *   - `accessorKey`: 'slug'
 *   - Displays the playlist slug as a clickable link that navigates to the playlist's detail page.
 *
 * - **Status**:
 *   - `accessorKey`: 'status'
 *   - Displays the playlist's status. If the status is `RUNNING` and there is a current slot and context,
 *     it shows the name of the current slot in progress.
 *
 * - **Strategy**:
 *   - `accessorKey`: 'strategy'
 *   - Displays the strategy associated with the playlist as a clickable link that navigates to the strategy's detail page.
 *
 * - **Created At**:
 *   - `accessorKey`: 'created_at'
 *   - Displays the creation timestamp. If the timestamp is within the last 24 hours, it shows a relative time (e.g., "5 hours ago").
 *     Otherwise, it shows the formatted date and time. A tooltip provides the full timestamp.
 *   - Includes a sortable header button.
 *
 * - **Updated At**:
 *   - `accessorKey`: 'updated_at'
 *   - Displays the last updated timestamp. If the timestamp is within the last 24 hours, it shows a relative time (e.g., "5 hours ago").
 *     Otherwise, it shows the formatted date and time. A tooltip provides the full timestamp.
 *   - Includes a sortable header button.
 */
export const columns: ColumnDef<Playlist>[] = [
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ cell }) => {
      const value = cell.getValue();
      return (
        value && (
          <Link asChild>
            <NavLink to={`/playlists/${value}`}>
              <code><>{value}</></code>
            </NavLink>
          </Link>
        )
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ cell, row }) => {
      /**
       * If the status is RUNNING and there is a current slot and context, display the current slot name.
       */
      if (cell.getValue() === 'RUNNING' && row.original.current_slot && row.original.context) {
        const { name } = row.original.context.sequence.find((item: { slot: number }) => item.slot === row.original.current_slot)
        return `In Progress: ${name}`
      }

      return cell.getValue();
    }
  },
  {
    accessorKey: 'strategy',
    header: 'Strategy',
    cell: ({ cell }) => {
      const value = cell.getValue() as { slug: string, name: string };
      return (
        value && (
          <Link asChild>
            <NavLink to={`/strategies/${value.slug}`}>
              <>{value.name}</>
            </NavLink>
          </Link>
        )
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Created
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ cell }) => {
      const value = cell.getValue();
      return value ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>{moment().diff(value, 'hours') < 24 ? moment(value).fromNow() : moment(value).format('MMM D, YYYY [at] HH:mm')}</TooltipTrigger>
            <TooltipContent>
              <>{value}</>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        ''
      );
    },
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Updated
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ cell }) => {
      const value = cell.getValue();
      return value ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>{moment().diff(value, 'hours') < 24 ? moment(value).fromNow() : moment(value).format('MMM D, YYYY [at] HH:mm')}</TooltipTrigger>
            <TooltipContent>
              <>{value}</>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        ''
      );
    },
  }
];

/**
 * DataTable component renders a paginated and sortable table for displaying playlist data.
 *
 * This component fetches data from an API endpoint using query parameters such as page, page size,
 * randomization, and sorting options. It listens to server-sent events (SSE) to refresh the table
 * when a specific action is triggered. The table supports manual pagination and sorting.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered DataTable component.
 *
 * @remarks
 * - The table uses `useReactTable` for managing table state and rendering.
 * - Server-sent events are used to trigger table refreshes dynamically.
 * - Pagination and sorting are handled manually via API query parameters.
 *
 * @example
 * ```tsx
 * <DataTable />
 * ```
 *
 * @dependencies
 * - `useState`, `useEffect`, `useMemo` from React for state and memoization.
 * - `useAPI` for fetching data from the API.
 * - `useSSE` for handling server-sent events.
 * - `useReactTable` for table management.
 *
 * @internal
 * - The `columns` variable is assumed to be defined elsewhere in the scope.
 * - The `PaginationControls` component is used for pagination UI.
 */
const DataTable = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [random, randomize] = useRandom();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'updated_at', desc: true }]);
  const { lastMessage } = useSSE();

  useEffect(() => {
    const { action } = JSON.parse(lastMessage ?? '{}');
    if (action == 'REFRESH_PLAYLISTS') {
      randomize();
    }
  }, [lastMessage]);


  const sortingParams = useMemo(() => {
    if (sorting.length > 0) {
      return { sort: sorting[0].id, order: sorting[0].desc ? 'desc' : 'asc' };
    }
    return {};
  }, [sorting]);

  const queryParams = useMemo(() => ({ page, pageSize, random, ...sortingParams }), [page, pageSize, sortingParams, random]);
  const { data } = useAPI(Method.GET, [], `playlists`, queryParams);

  const table = useReactTable({
    data: data?.rows ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    manualPagination: true,
  });

  /**
   * Calculate the total number of pages based on the total number of rows and the page size.
   */
  const totalPages = useMemo(() => Math.ceil((data?.count || 0) / pageSize), [data, pageSize]);

  return (
    <div className='m-4'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data?.rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-between space-x-2 py-4'>
        <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export { DataTable };
