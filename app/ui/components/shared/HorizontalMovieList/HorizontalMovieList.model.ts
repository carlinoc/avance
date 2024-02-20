import { HTMLAttributes } from 'react';

export interface HorizontalMovieListTypes
  extends HTMLAttributes<HTMLDivElement> {
  title: string;
  movieList: FreeShortsMoviesListAPI[];
}

export interface HorizontalMovieListPrimaryTypes
  extends HorizontalMovieListTypes {
  path: string;
}

export interface HorizontalMovieListSecondaryTypes
  extends HorizontalMovieListTypes {
  description?: string;
}
