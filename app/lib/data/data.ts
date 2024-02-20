import { genresListTypes } from './genreList/genreList.model';

export async function fetchTrending() {
  const apiUrl =
    'https://api.themoviedb.org/3/trending/movie/day?language=es-CO';

  const options = {
    next: { revalidate: 86400 },
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
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
    throw new Error('Error fetching trending data');
  }
}

export async function fetchMovieNowPlaying() {
  const apiUrl =
    'https://api.themoviedb.org/3/movie/now_playing?language=es-CO-US&page=1';

  const options = {
    next: { revalidate: 86400 },
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
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
    throw new Error('Error fetching trending data');
  }
}

export async function fetchMovieDetails(movieId: number) {
  const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=es-CO`;
  const options = {
    next: { revalidate: 86400 },
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
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

export async function fetchMovieList({
  genreId,
  page = 1,
}: {
  genreId: number;
  page?: number;
}) {
  const apiUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=es-CO-US&page=${page}&sort_by=popularity.desc&with_genres=${genreId}`;
  const options = {
    next: { revalidate: 86400 },
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${
        process.env.ACCESS_TOKEN || process.env.NEXT_PUBLIC_ACCESS_TOKEN
      }`,
    },
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

export async function fetchMovieDataForGenres(genresList: genresListTypes[]) {
  const resultArray = [];

  for (const genre of genresList) {
    try {
      const { results: movies } = await fetchMovieList({ genreId: genre.id });
      resultArray.push({ genre: genre.name, slug: genre.slug, movies });
    } catch (error) {
      console.error(`Error fetching movies for genre ${genre.name}: ${error}`);
    }
  }

  return resultArray;
}

export async function fetchVideoMovie(movieId: number) {
  const apiUrl = `
  https://api.themoviedb.org/3/movie/${movieId}/videos?language=es-CO`;
  const options = {
    next: { revalidate: 86400 },
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
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
    throw new Error('Error fetching videos');
  }
}
