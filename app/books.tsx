import type { Context } from "hono";
import { books as booksData } from "../db/books";

type Book = (typeof booksData.books)[number];

function getUniqueSeries(books: Book[]): string[] {
  const seriesSet = new Set(books.map((book) => book.series));
  return Array.from(seriesSet).sort();
}

function sortBooks(books: Book[], sortBy: string): Book[] {
  if (sortBy === "year") {
    return [...books].sort((a, b) => a.year - b.year);
  }
  return [...books].sort((a, b) => a.rank - b.rank);
}

type Predicate = (book: Book) => boolean;

const bySeries =
  (series: string): Predicate =>
  (book) =>
    book.series === series;

const byMinRating = (rating: string): Predicate => {
  const ratingNum = parseInt(rating, 10);
  return (book) => book.rating >= ratingNum;
};

const bySearch = (search: string): Predicate => {
  const searchLower = search.toLowerCase();
  return (book) =>
    book.title.toLowerCase().includes(searchLower) ||
    book.series.toLowerCase().includes(searchLower) ||
    book.commentary.toLowerCase().includes(searchLower);
};

function filterBooks(
  books: Book[],
  search: string,
  series: string,
  rating: string,
): Book[] {
  const predicates: Predicate[] = [];

  if (series) predicates.push(bySeries(series));
  if (rating) predicates.push(byMinRating(rating));
  if (search) predicates.push(bySearch(search));

  return books.filter((book) => predicates.every((p) => p(book)));
}

function BookCard({ book }: { book: Book }) {
  return (
    <article
      class="br-s w-full"
      style={`view-transition-name: book-${book.slug}; view-transition-class: book;`}
    >
      <div style="display: grid; grid-template-columns: 1fr auto; gap: var(--spacing-xl);">
        <div>
          <div
            class="br-s crazy-gradient"
            style="aspect-ratio: 3/4; width: 100%; max-width: 16rem; margin: auto;"
          ></div>
        </div>
        <div class="my-l" style="max-width: 42ch;">
          <h3 class="text-l text-bold mb-m">
            {book.title} <span class="fg-subtle">({book.year})</span>
          </h3>
          <flex-stack gap="3xs">
            <p>
              <strong>Series</strong> {book.series}
            </p>
            <p>
              <strong>Rating</strong> {book.rating}/5
            </p>
          </flex-stack>
          <div class="mt-l">
            <p>{book.commentary}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function SearchForm({
  currentSearch,
  currentSeries,
  currentRating,
  currentSort,
  allSeries,
}: {
  currentSearch: string;
  currentSeries: string;
  currentRating: string;
  currentSort: string;
  allSeries: string[];
}) {
  return (
    <form method="get" action="/books">
      <flex-stack gap="m">
        <flex-stack gap="2xs">
          <label class="text-s" for="search">
            Search
          </label>
          <input
            class="input"
            type="text"
            id="search"
            data-size="l"
            name="search"
            value={currentSearch}
            placeholder="Title, series, commentary..."
          />
        </flex-stack>
        <flex-stack gap="2xs">
          <label class="text-s" for="series">
            Series
          </label>
          <select
            auto-submit
            class="select"
            id="series"
            data-size="s"
            name="series"
          >
            <option value="" selected={currentSeries === ""}>
              All series
            </option>
            {allSeries.map((s) => (
              <option key={s} value={s} selected={currentSeries === s}>
                {s}
              </option>
            ))}
          </select>
        </flex-stack>
        <flex-stack gap="2xs">
          <label class="text-s" for="rating">
            Rating
          </label>
          <select
            auto-submit
            class="select"
            id="rating"
            data-size="s"
            name="rating"
          >
            <option value="" selected={currentRating === ""}>
              Any rating
            </option>
            {[5, 4, 3, 2].map((r) => (
              <option
                key={r}
                value={r.toString()}
                selected={currentRating === r.toString()}
              >
                {r}+ stars
              </option>
            ))}
          </select>
        </flex-stack>
        <flex-stack gap="2xs">
          <button
            class="button"
            data-variant="tertiary"
            popovertarget="mainpopover"
            popovertargetaction="toggle"
            type="button"
          >
            Sort by: {currentSort || "rank"}
          </button>
          <div
            class="popover-filter br-xs mb-3xs p-xs px-m bg-default box-shadow-m border bc-default"
            id="mainpopover"
            popover="auto"
            style=""
          >
            <nav class="listcontainer">
              What to sort by
              <flex-stack gap="">
                <label for="sort-rank" class="px-xs py-2xs">
                  <flex-stack horizontal="center" gap="2xs">
                    <input
                      class="radio"
                      type="radio"
                      data-size="s"
                      id="sort-rank"
                      name="sort"
                      auto-submit
                      value="rank"
                      checked={currentSort !== "year"}
                    />
                    <span>Rank</span>
                  </flex-stack>
                </label>
                <label for="sort-year" class="px-xs py-2xs">
                  <flex-stack horizontal="center" gap="2xs">
                    <input
                      class="radio"
                      type="radio"
                      data-size="s"
                      id="sort-year"
                      name="sort"
                      auto-submit
                      value="year"
                      checked={currentSort === "year"}
                    />
                    <span>Release date</span>
                  </flex-stack>
                </label>
              </flex-stack>
            </nav>
          </div>
        </flex-stack>
        <flex-stack gap="s">
          <button class="button" type="submit">
            Search
          </button>
          <a class="button" data-size="s" data-variant="tertiary" href="/books">
            Clear
          </a>
        </flex-stack>
      </flex-stack>
    </form>
  );
}

export function BooksPage({
  search,
  series,
  rating,
  sort,
}: {
  search: string;
  series: string;
  rating: string;
  sort: string;
}) {
  const allBooks = booksData.books;
  const allSeries = getUniqueSeries(allBooks);
  const filteredBooks = sortBooks(
    filterBooks(allBooks, search, series, rating),
    sort,
  );
  const hasFilters = search || series || rating;

  return (
    <flex-stack gap="l" class="py-xl">
      {/*<header class="p-m" style="max-width: 50ch;">
        <h1 class="text-2xl text-bold mb-xs">{booksData.collection}</h1>
        <p>{booksData.note}</p>
      </header>*/}

      <div style="display: grid; grid-template-columns: 250px 1fr; gap: var(--spacing-2xl); align-items: start;">
        <aside class="p-m mt-xl">
          <SearchForm
            currentSearch={search}
            currentSeries={series}
            currentRating={rating}
            currentSort={sort}
            allSeries={allSeries}
          />
        </aside>

        <div>
          {hasFilters && (
            <p class="mb-xl text-right">
              Showing {filteredBooks.length} of {allBooks.length} books
              {search && (
                <>
                  {" "}
                  for <span class="text-bold">"{search}"</span>
                </>
              )}
              {series && (
                <>
                  {" "}
                  in <span class="text-bold">{series}</span>
                </>
              )}
              {rating && (
                <>
                  {" "}
                  rated <span class="text-bold">{rating}+ stars</span>
                </>
              )}
            </p>
          )}

          <flex-stack gap="xl">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <BookCard key={book.slug} book={book} />
              ))
            ) : (
              <p>No books found matching your filters.</p>
            )}
          </flex-stack>
        </div>
      </div>
    </flex-stack>
  );
}

export const booksHandlers = {
  get: (c: Context) => {
    const search = c.req.query("search") || "";
    const series = c.req.query("series") || "";
    const rating = c.req.query("rating") || "";
    const sort = c.req.query("sort") || "";
    return c.render(
      <BooksPage search={search} series={series} rating={rating} sort={sort} />,
    );
  },
};
