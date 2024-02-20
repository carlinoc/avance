/**
 * Retrieves a list of movies from the API.
 *
 * @param {Object} options - Options for fetching movies.
 * @param {number} options.top - The number of top movies to retrieve (default is 10).
 * @returns {Promise<Array>} - A Promise that resolves to an array of movie data.
 * @throws {Error} - Throws an error if there is an issue fetching the movie list.
 */ export async function fetchMovieList({ top = 10 }: { top: number }) {
  const apiUrl = `${process.env.API_URL}/api/movies?top=${top}`;
  const options = {
    next: { revalidate: 3600 },
  };

  try {
    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      const error: Error = new Error(
        `Error: ${response.status} - ${response.statusText}`,
      );
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error fetching movie list');
  }
}

/**
 * Retrieves details for a specific movie using its slug.
 *
 * @param {string} movieSlug - The unique identifier (slug) of the movie.
 * @returns {Promise<Object>} - A Promise that resolves to detailed information about the movie.
 * @throws {Error} - Throws an error if there is an issue fetching movie details.
 */
export async function fetchMovieDetails(movieSlug: string) {
  const apiUrl = `${process.env.API_URL}/api/movies/${movieSlug}`;
  const options = {
    next: { revalidate: 3600 },
  };

  try {
    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      const error: Error = new Error(
        `Error: ${response.status} - ${response.statusText}`,
      );
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error fetching movie details');
  }
}

/**
 * Retrieves data for a specific section of the home page.
 *
 * @param {Object} options - Options for fetching home section data.
 * @param {string} options.section - The section identifier to retrieve data for.
 * @returns {Promise<Object>} - A Promise that resolves to data for the specified home section.
 * @throws {Error} - Throws an error if there is an issue fetching home section data.
 */
export async function fetchHomeSection({ section }: { section: string }) {
  const apiUrl = `${process.env.API_URL}/api/homesection/${section}`;
  const options = {
    next: { revalidate: 3600 },
  };

  try {
    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      const error: Error = new Error(
        `Error: ${response.status} - ${response.statusText}`,
      );
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error fetching home section');
  }
}

/**
 * Retrieves a list of free short films from the API.
 *
 * @returns {Promise<Array>} - A Promise that resolves to an array of free short film data.
 * @throws {Error} - Throws an error if there is an issue fetching the free shorts list.
 */
export async function fetchFreeShortsList() {
  const apiUrl = `${process.env.API_URL}/api/freeshorts?top=10}`;
  const options = {
    next: { revalidate: 3600 },
  };

  try {
    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      const error: Error = new Error(
        `Error: ${response.status} - ${response.statusText}`,
      );
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error fetching free shorts list');
  }
}

/**
 * Retrieves a list of movie genres or categories from the API.
 *
 * @param {Object} options - Options for fetching genres or categories.
 * @param {string} options.list - Specify 'genres' or 'categories' to get the respective list.
 * @returns {Promise<Array>} - A Promise that resolves to an array of genres or categories.
 * @throws {Error} - Throws an error if there is an issue fetching genres.
 */
export async function fetchGenresList({
  list,
}: {
  list: 'genres' | 'categories';
}) {
  const apiUrl = `${process.env.API_URL}/api/${list}`;
  const options = {
    next: { revalidate: 3600 },
  };

  try {
    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      const error: Error = new Error(
        `Error: ${response.status} - ${response.statusText}`,
      );
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error fetching genres');
  }
}

/**
 * Retrieves a list of movies for a specific genre from the API.
 *
 * @param {Object} options - Options for fetching movies for a genre.
 * @param {string} options.genreSlug - The unique identifier (slug) of the genre.
 * @param {number} options.top - The number of top movies to retrieve (default is 10).
 * @returns {Promise<Array>} - A Promise that resolves to an array of movies for the specified genre.
 * @throws {Error} - Throws an error if there is an issue fetching movies for the genre.
 */
export async function fetchMovieListForGenre({
  genreSlug,
  top = 10,
}: {
  genreSlug: string;
  top: number;
}) {
  const apiUrl = `${process.env.API_URL}/api/movies-genre/${genreSlug}?top=${top}`;
  const options = {
    next: { revalidate: 3600 },
  };

  try {
    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      const error: Error = new Error(
        `Error: ${response.status} - ${response.statusText}`,
      );
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error fetching movies for genre');
  }
}

/**
 * Retrieves movie data for each genre in the provided list.
 *
 * @param {Array} genresList - An array of genre objects containing name and slug.
 * @returns {Promise<Array>} - A Promise that resolves to an array of objects, each containing genre, slug, and movie data.
 * @throws {Error} - Throws an error if there is an issue fetching movies for any genre.
 */
export async function fetchMovieDataForGenres(genresList: GenresListAPI[]) {
  const resultArray: {
    genre: string;
    slug: string;
    data: MovieAPI[];
  }[] = [];

  for (const genre of genresList) {
    try {
      const { data }: MoviesDataForGenresRequestAPI =
        await fetchMovieListForGenre({
          genreSlug: genre.slug,
          top: 10,
        });

      const moviesData: (MovieAPI | null)[] = data.flatMap(
        (item: GenreInfoAPI) => item.movies,
      );

      resultArray.push({
        genre: genre.name,
        slug: genre.slug,
        data: moviesData as MovieAPI[],
      });
    } catch (error) {
      console.error(`Error fetching movies for genre ${genre.name}: ${error}`);
      resultArray.push({ genre: genre.name, slug: genre.slug, data: [] });
    }
  }

  return resultArray;
}

export async function fetchUserData({ email }: { email: string }) {
  const apiUrl = `${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL}/api/clients?email=${email}`;
  const options = {
    next: { revalidate: 0, cache: 'no-store' },
  };

  try {
    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      const error: Error = new Error(
        `Error: ${response.status} - ${response.statusText}`,
      );
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error fetching user data');
  }
}
