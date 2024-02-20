// Import necessary dependencies and types
import { fetchHomeSection, fetchMovieListForGenre } from '@/app/lib/data/fetch';
import { Hero } from '@/app/ui/components/Genres/Hero';
import { MovieList } from '@/app/ui/components/Genres/MovieList';
import { NoMoviesAvailable } from '@/app/ui/components/Genres/NoMoviesAvailable';
import { ScrollTopButtonWrapper } from '@/app/ui/components/shared/ScrollTopButtonWrapper';

/**
 * Genre Page
 *
 * This page component fetches and displays information about movies belonging to a specific genre.
 * It utilizes the `fetchMovieListForGenre` function to retrieve the list of movies for the specified genre
 * and displays a Hero component featuring the first movie from the fetched list. If no movies are available,
 * it displays a message using the NoMoviesAvailable component.
 *
 * @component
 * @param {Object} params - The parameters object containing the genre slug.
 * @param {string} params.genre - The slug of the genre to display.
 * @returns {JSX.Element} - JSX element representing the Genre Page.
 * @throws {Error} - Throws an error if there is an issue fetching the movie list.
 */
export default async function GenrePage({
  params,
}: {
  params: { genre: string };
}) {
  // Extract genre slug from parameters
  const genreSlug = params.genre;

  try {
    // Set up default genre information structure
    const defaultGenreInfo: GenreInfoAPI = {
      id: 0,
      name: '',
      description: '',
      movies: [],
    };

    let movieList: MovieAPI[] = [];

    // Fetch the list of movies for the specified genre
    const {
      data: [genreData],
    }: { data: GenreInfoAPI[] } = (await fetchMovieListForGenre({
      genreSlug,
      top: 10,
    })) ?? { data: [] };

    // If there are movies available, display the Hero component with information about the first movie
    if (genreData && genreData.movies && genreData.movies.length > 0) {
      Object.assign(defaultGenreInfo, {
        id: genreData.id,
        name: genreData.name,
        description: genreData.description,
        movies: genreData.movies.reverse(),
      });

      movieList = [...(genreData.movies as MovieAPI[])];
    } else {
      // If no movies available, fetch data for the "Cortometrajes Gratuitos" section
      const { data }: HomeSectionRequestAPI = await fetchHomeSection({
        section: genreSlug,
      });
      const homeSectionData = data[0];

      Object.assign(defaultGenreInfo, {
        id: homeSectionData.id,
        name: homeSectionData.name,
        description: homeSectionData.description,
        movies: homeSectionData.movies.reverse(),
      });

      movieList = [...(homeSectionData.movies as MovieAPI[])];
    }

    // Display the Genre Page with Hero and MovieList components
    return (
      <section className="w-full">
        <ScrollTopButtonWrapper>
          <>
            <Hero genreInfo={defaultGenreInfo} movieInfo={movieList[0]} />
            <MovieList genreInfo={defaultGenreInfo} movieList={movieList} />
          </>
        </ScrollTopButtonWrapper>
      </section>
    );
  } catch (error) {
    // Handle errors when fetching the movie list
    console.error('Error fetching movie list:', error);
    throw new Error('Failed to fetch movie list. Please try again later.');
  }

  // Display a message when no movies are available
  return <NoMoviesAvailable />;
}
