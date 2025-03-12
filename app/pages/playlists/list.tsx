import { Table } from '@radix-ui/themes';
import { Link } from 'react-router';
import { Method, useAPI } from '~/clients/api';

const PlaylistsList = () => {
  const { data, loading } = useAPI(Method.GET, [], `playlists`);

  /**
   * Ugliest table. But it's just a placeholder.
   */
  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Slug</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Current Slot</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Strategy</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Updated</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {data &&
          data['rows'].map((playlist: any) => (
            <Table.Row key={playlist.id}>
              <Table.RowHeaderCell>
                <Link to={`/playlists/${playlist.slug}`}>{playlist.slug}</Link>
              </Table.RowHeaderCell>
              <Table.Cell>{playlist.status}</Table.Cell>
              <Table.Cell>{playlist.current_slot || 'Finished'}</Table.Cell>
              <Table.Cell>
                <Link to={`/strategies/${playlist.strategy.slug}`}>{playlist.strategy.name}</Link>
              </Table.Cell>
              <Table.Cell>{playlist.created_at}</Table.Cell>
              <Table.Cell>{playlist.updated_at}</Table.Cell>
              <Table.Cell>
                <Link to={`/playlists/${playlist.slug}`}>View</Link>
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table.Root>
  );
};

export default PlaylistsList;
