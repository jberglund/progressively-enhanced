import { Hono } from "hono";
import { ASeriousForm } from "./3-a-serious-form";
import { ReservationForm } from "./9-reservation";

export const path = "/popover";
const app = new Hono().basePath(path);

/*

  Kraften av URL:er
  Importera form
  Visa popover="auto"|"manual"

  Byt till enhance-form.

  Å kom ihåg: en POST är inte alltid en POST.
  * queue mysterious ambiance *
*/

export function PopoverDemo() {
  return (
    <flex-stack
      gap="l"
      style="
        height: 100vh;
        display: grid;
        place-content: center;
    "
    >
      <h2>Actions & Popover</h2>
      {/*<flex-stack gap="m">
        <button class="button" popovertarget="action-popover">
          Toggle Popover
        </button>

        <div
          id="action-popover"
          popover="manual"
          class="p-l br-m"
          style="position-area: x-end; translateX(10px)"
        >
          <h3 class="mb-xl">0% Client Javascript!</h3>
          <button
            class="button mt-xs"
            data-variant="tertiary"
            popovertarget="action-popover"
            style="width: 100%;"
          >
            Close
          </button>
        </div>
      </flex-stack>*/}
    </flex-stack>
  );
}

app.get("/", (c) => c.render(<PopoverDemo />));

export default app;
