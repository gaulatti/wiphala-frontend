import { Button } from '@radix-ui/themes';
import { type ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, type SortingState, useReactTable } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Method, useAPI } from '~/clients/api';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';

export type Playlist = {
  slug: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
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
    header: 'Created',
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Updated
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
  },
];

const DataTable = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [sorting, setSorting] = useState<SortingState>([]);
  const queryParams = useMemo(() => ({ page, pageSize, sorting }), [page, pageSize, sorting]);
  const { data, loading, error } = useAPI(Method.GET, [], `playlists`, queryParams);

  const table = useReactTable({
    data: data?.rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
