import MovieUpsertForm from '@/app/components/MovieUpsertForm';

export default function EditMoviePage({ params }) {
  return <MovieUpsertForm movieId={params?.id} />;
}

