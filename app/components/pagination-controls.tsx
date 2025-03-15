import { useMemo } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '~/components/ui/pagination';
import { getPaginationRange, renderPaginationLinks } from '~/utils/tables';

/**
 * Props for the PaginationControls component.
 *
 * @typedef PaginationControlsProps
 * @property {number} currentPage - The current active page number.
 * @property {number} totalPages - The total number of pages available.
 * @property {function} onPageChange - Callback function to handle page changes.
 * @param {number} page - The page number to change to.
 */
type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

/**
 * PaginationControls component renders pagination controls including previous, next, and page number links.
 *
 * @param {Object} props - The properties object.
 * @param {number} props.currentPage - The current active page number.
 * @param {number} props.totalPages - The total number of pages available.
 * @param {function} props.onPageChange - The callback function to handle page changes.
 *
 * @returns {JSX.Element} The rendered pagination controls component.
 */
export const PaginationControls = ({ currentPage, totalPages, onPageChange }: PaginationControlsProps) => {
  const paginationRange = useMemo(() => getPaginationRange(currentPage, totalPages), [currentPage, totalPages]);
  const paginationLinks = useMemo(() => renderPaginationLinks(paginationRange, currentPage, onPageChange), [paginationRange, currentPage, onPageChange]);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              onPageChange(Math.max(currentPage - 1, 1));
            }}
            className={currentPage === 1 ? 'disabled' : ''}
            href='#'
          />
        </PaginationItem>
        {paginationLinks}
        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault();
              onPageChange(Math.min(currentPage + 1, totalPages));
            }}
            className={currentPage === totalPages ? 'disabled' : ''}
            href='#'
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
