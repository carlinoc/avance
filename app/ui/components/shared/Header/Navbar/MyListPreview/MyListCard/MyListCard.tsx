// Import necessary dependencies and types
import Link from 'next/link';
import Image from 'next/image';
import { calculateTimeToMovie } from '@/app/lib/utils/calculateTimeToMovie';

/**
 * MyListCard Component
 *
 * A React component representing a card in the MyListPreview section. It displays movie information,
 * including the poster, title, and additional details.
 *
 * @component
 * @param {Object} props - The properties of the MyListCard component.
 * @param {TrendingMovieType} props.movie - An object containing information about the movie.
 * @returns {JSX.Element} - JSX element representing the MyListCard component.
 */
export function MyListCard({ movie }: { movie: MovieUserList }) {
  const { name, image2, slug, date_end, date_start } = movie;
  /**
   * Render the JSX for the MyListCard component
   */
  return (
    <Link
      href={`/peliculas/${slug}`}
      className="grid grid-cols-5 items-center w-full p-4 hover:bg-dark-800"
    >
      {/* Movie poster section */}
      <span className="col-span-1 relative w-4/5 md:w-3/5 aspect-[2/3]">
        {/* Movie poster image using Next.js Image component */}
        <Image
          fill
          sizes="(max-width: 768px)"
          src={`https://cdn.cursosya.info/${image2}`}
          alt={name || 'Movie Card'}
          placeholder="blur"
          loading="lazy"
          className="object-cover object-center md:group-hover:scale-110 transition-all duration-200 ease-in"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
        />
      </span>
      {/* Movie details section */}
      <div className="col-span-4 flex flex-col w-full text-textColorNeutral-50">
        {/* Movie title */}
        <span className="span-lg capitalize font-semibold ">{name}</span>
        {/* Additional details */}
        {/* <span className="span-base font-medium text-textColorAccent-500">
          ¡Aún no has visto la película!
        </span> */}
        <span className="span-base font-medium text-textColorAccent-500">
          {calculateTimeToMovie({
            startDate: date_start,
            endDate: date_end,
          })}
        </span>
      </div>
    </Link>
  );
}
