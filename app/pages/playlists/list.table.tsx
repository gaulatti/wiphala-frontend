import { Button } from '@radix-ui/themes';
import { type ColumnDef, flexRender, getCoreRowModel, type SortingState, useReactTable } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { Method, useAPI } from '~/clients/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
export type Playlist = {
  slug: string;
  status: 'CREATED' | 'RUNNING' | 'FAILED' | 'COMPLETE';
  current_slot: number | null;
  strategy: { slug: string; name: string };
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<Playlist>[] = [
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'current_slot',
    header: 'Current Slot',
  },
  {
    accessorKey: 'strategy.name',
    header: 'Strategy',
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Created
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue('created_at');
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
    cell: ({ row }) => {
      const value = row.getValue('updated_at');
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
    id: 'actions',
    cell: ({ row }) => {
      const item = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.slug)}>Copy payment ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const DataTable = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [sorting, setSorting] = useState<SortingState>([]);

  const sortingParams = useMemo(() => {
    if (sorting.length > 0) {
      return { sort: sorting[0].id, order: sorting[0].desc ? 'desc' : 'asc' };
    }
    return {};
  }, [sorting]);

  const queryParams = useMemo(() => ({ page, pageSize, ...sortingParams }), [page, pageSize, sortingParams]);
  const { data, loading, error } = useAPI(Method.GET, [], `playlists`, queryParams);

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

  return (
    <div>
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
        <span>
          Page {page} of {Math.ceil(data?.count / pageSize)}
        </span>
        <div>
          <Button variant='outline' size={'1'} onClick={() => setPage(Math.max(page - 1, 1))} disabled={page === 1}>
            Previous
          </Button>
          <Button variant='outline' size={'1'} onClick={() => setPage(page + 1)} disabled={page * pageSize >= data?.count}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export { DataTable };
