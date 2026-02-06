import type { Context } from "hono";
import { Hono } from "hono";

/*
  Vad sker här?

  FormData är gratis serialisering.
  Formdata.get() och name=""

  FormData and GET

*/
export const path = "/form";

const app = new Hono().basePath(path);

app.on(["GET", "POST"], "/", async (c: Context) => {
  let error = "";
  if (c.req.method === "POST") {
    const formdata = await c.req.formData();
    const firstname = (formdata.get("firstname") || "") as string;

    if (firstname.match(/^[a-zA-Z]+$/)) {
      // Repeat form submissions och Location Header.
      return c.redirect("/form/success");
    } else {
      error = "Name should only have letters!";
    }
  }

  return c.render(<SimpleForm error={error} />);
});

app.get("/success", (c: Context) => c.render(<Success />));

export function SimpleForm({ error }: { error?: string }) {
  return (
    <form class="premade-form" method="post" action={path}>
      <fieldset>
        <label for="name">Name</label>
        <input class="input" type="text" id="name" name="firstname" />
        {error && <p style="color: red;">{error}</p>}
      </fieldset>
      <button class="button" type="submit">
        Submit
      </button>
    </form>
  );
}

function Success() {
  return (
    <div>
      <h1>Hurra! 🥳</h1>
      <p>Skjema ble sendt – alle er glade!</p>
      <a href={path}>Tilbake til skjema</a>
    </div>
  );
}

export default app;
