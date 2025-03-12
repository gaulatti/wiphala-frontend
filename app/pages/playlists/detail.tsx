import { useParams } from 'react-router';
import { Method, useAPI } from '~/clients/api';

const PlaylistsDetail = () => {
  const { slug } = useParams();
  const { data, loading } = useAPI(Method.GET, [], `playlists/${slug}`);
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default PlaylistsDetail;
