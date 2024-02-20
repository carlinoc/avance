import { Hero } from '@/app/ui/components/MovieDetails/Hero';

export default function page({ params }: { params: { id: string } }) {
  const movieId: string = params.id;
  return <Hero movieId={movieId} />;
}
