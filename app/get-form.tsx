import type { Context } from "hono";

export const getForm = (c: Context) => {
  const { req } = c;
  const search = req.query("search") || "";
  const featured = req.query("featured") === "on";
  const sale = req.query("sale") === "on";

  return c.render(
    <form method="get">
      <input type="text" name="search" value={search} placeholder="Search..." />

      <label>
        <input type="checkbox" name="featured" checked={featured} />
        Featured
      </label>

      <label>
        <input type="checkbox" name="sale" checked={sale} />
        On Sale
      </label>

      <button type="submit">Apply Filters</button>
    </form>,
  );
};
