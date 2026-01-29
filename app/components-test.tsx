export const ComponentsTest = () => {
  return (
    <main class="p-xl mx-auto" style={{ maxWidth: "1200px" }}>
      <h1 class="mb-xl">Component Test Bench</h1>

      <section class="mb-2xl">
        <h2 class="mb-m">Buttons</h2>

        <div class="mb-l">
          <h3 class="mb-s">Primary (default)</h3>
          <flex-stack horizontal="start" gap="m">
            <button class="button" data-size="s">
              Small
            </button>
            <button class="button">Medium</button>
            <button class="button" data-size="l">
              Large
            </button>
            <button class="button" disabled>
              Disabled
            </button>
          </flex-stack>
        </div>

        <div class="mb-l">
          <h3 class="mb-s">Secondary</h3>
          <flex-stack horizontal="start" gap="m">
            <button class="button" data-variant="secondary" data-size="s">
              Small
            </button>
            <button class="button" data-variant="secondary">
              Medium
            </button>
            <button class="button" data-variant="secondary" data-size="l">
              Large
            </button>
            <button class="button" data-variant="secondary" disabled>
              Disabled
            </button>
          </flex-stack>
        </div>

        <div class="mb-l">
          <h3 class="mb-s">Tertiary</h3>
          <flex-stack horizontal="start" gap="m">
            <button class="button" data-variant="tertiary" data-size="s">
              Small
            </button>
            <button class="button" data-variant="tertiary">
              Medium
            </button>
            <button class="button" data-variant="tertiary" data-size="l">
              Large
            </button>
            <button class="button" data-variant="tertiary" disabled>
              Disabled
            </button>
          </flex-stack>
        </div>
      </section>

      <section class="mb-2xl">
        <h2 class="mb-m">Text Inputs</h2>

        <flex-stack horizontal="start" gap="m">
          <div>
            <label class="mb-2xs" style={{ display: "block" }}>
              Small
            </label>
            <input
              class="input"
              data-size="s"
              type="text"
              placeholder="Small input"
            />
          </div>
          <div>
            <label class="mb-2xs" style={{ display: "block" }}>
              Medium (default)
            </label>
            <input class="input" type="text" placeholder="Medium input" />
          </div>
          <div>
            <label class="mb-2xs" style={{ display: "block" }}>
              Large
            </label>
            <input
              class="input"
              data-size="l"
              type="text"
              placeholder="Large input"
            />
          </div>
          <div>
            <label class="mb-2xs" style={{ display: "block" }}>
              Disabled
            </label>
            <input class="input" type="text" placeholder="Disabled" disabled />
          </div>
          <div>
            <label class="mb-2xs" style={{ display: "block" }}>
              Error
            </label>
            <input
              class="input"
              type="text"
              placeholder="Error state"
              aria-invalid="true"
            />
          </div>
        </flex-stack>
      </section>

      <section class="mb-2xl">
        <h2 class="mb-m">Selects</h2>

        <flex-stack horizontal="start" gap="m">
          <div>
            <label class="mb-2xs" style={{ display: "block" }}>
              Small
            </label>
            <select class="select" data-size="s">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
          <div>
            <label class="mb-2xs" style={{ display: "block" }}>
              Medium (default)
            </label>
            <select class="select">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
          <div>
            <label class="mb-2xs" style={{ display: "block" }}>
              Large
            </label>
            <select class="select" data-size="l">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
          <div>
            <label class="mb-2xs" style={{ display: "block" }}>
              Disabled
            </label>
            <select class="select" disabled>
              <option>Disabled</option>
            </select>
          </div>
        </flex-stack>
      </section>

      <section class="mb-2xl">
        <h2 class="mb-m">Textareas</h2>

        <flex-stack horizontal="start" gap="m">
          <div>
            <label class="mb-2xs" style={{ display: "block" }}>
              Small
            </label>
            <textarea
              class="textarea"
              data-size="s"
              placeholder="Small textarea"
              rows={3}
            />
          </div>
          <div>
            <label class="mb-2xs" style={{ display: "block" }}>
              Medium (default)
            </label>
            <textarea class="textarea" placeholder="Medium textarea" rows={3} />
          </div>
          <div>
            <label class="mb-2xs" style={{ display: "block" }}>
              Large
            </label>
            <textarea
              class="textarea"
              data-size="l"
              placeholder="Large textarea"
              rows={3}
            />
          </div>
          <div>
            <label class="mb-2xs" style={{ display: "block" }}>
              Error
            </label>
            <textarea
              class="textarea"
              placeholder="Error state"
              aria-invalid="true"
              rows={3}
            />
          </div>
        </flex-stack>
      </section>

      <section class="mb-2xl">
        <h2 class="mb-m">Checkboxes & Radios</h2>

        <flex-stack horizontal="start" gap="2xl">
          <div>
            <h3 class="mb-s">Checkboxes</h3>
            <flex-stack gap="xs">
              <label>
                <flex-stack horizontal="start" gap="xs">
                  <input type="checkbox" class="checkbox" />
                  <span>Unchecked</span>
                </flex-stack>
              </label>
              <label>
                <flex-stack horizontal="start" gap="xs">
                  <input type="checkbox" class="checkbox" checked />
                  <span>Checked</span>
                </flex-stack>
              </label>
              <label>
                <flex-stack horizontal="start" gap="xs">
                  <input type="checkbox" class="checkbox" disabled />
                  <span>Disabled</span>
                </flex-stack>
              </label>
            </flex-stack>
          </div>

          <div>
            <h3 class="mb-s">Radios</h3>
            <flex-stack gap="xs">
              <label>
                <flex-stack horizontal="start" gap="xs">
                  <input type="radio" class="radio" name="test-radio" />
                  <span>Option 1</span>
                </flex-stack>
              </label>
              <label>
                <flex-stack horizontal="start" gap="xs">
                  <input type="radio" class="radio" name="test-radio" checked />
                  <span>Option 2 (checked)</span>
                </flex-stack>
              </label>
              <label>
                <flex-stack horizontal="start" gap="xs">
                  <input
                    type="radio"
                    class="radio"
                    name="test-radio"
                    disabled
                  />
                  <span>Option 3 (disabled)</span>
                </flex-stack>
              </label>
            </flex-stack>
          </div>
        </flex-stack>
      </section>

      <section class="mb-2xl">
        <h2 class="mb-m">Combined Example Form</h2>

        <form style={{ maxWidth: "400px" }}>
          <flex-stack gap="m">
            <div>
              <label class="mb-2xs" style={{ display: "block" }}>
                Name
              </label>
              <input
                class="input"
                type="text"
                placeholder="Enter your name"
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label class="mb-2xs" style={{ display: "block" }}>
                Email
              </label>
              <input
                class="input"
                type="email"
                placeholder="you@example.com"
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label class="mb-2xs" style={{ display: "block" }}>
                Country
              </label>
              <select class="select" style={{ width: "100%" }}>
                <option>Norway</option>
                <option>Sweden</option>
                <option>Denmark</option>
              </select>
            </div>

            <div>
              <label class="mb-2xs" style={{ display: "block" }}>
                Message
              </label>
              <textarea
                class="textarea"
                placeholder="Your message..."
                rows={4}
                style={{ width: "100%" }}
              />
            </div>

            <label>
              <flex-stack horizontal="start" gap="xs">
                <input type="checkbox" class="checkbox" />
                <span>I agree to the terms</span>
              </flex-stack>
            </label>

            <flex-stack horizontal="start" gap="s">
              <button class="button" type="submit">
                Submit
              </button>
              <button class="button" data-variant="secondary" type="reset">
                Reset
              </button>
              <button class="button" data-variant="tertiary" type="button">
                Cancel
              </button>
            </flex-stack>
          </flex-stack>
        </form>
      </section>
    </main>
  );
};
