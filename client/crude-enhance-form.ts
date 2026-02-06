// ---
/*
  Web components är ett stort tema

  Javascript är vanligtvis globalt, men ett custom element binder det till ett HTML element.

  `this` betyder alltså själva elementet. så `<crude-enhance-form>` är `this`.

  Vi kommer se varför connectedCallback är viktigt senare, men förklara nu.

*/

const parser = new DOMParser();

class CrudeEnhanceForm extends HTMLElement {
  static tagName = "crude-enhance-form";
  form: HTMLFormElement;

  constructor() {
    super();
    const form = this.querySelector("form");

    if (!form) throw new Error("No form!");
    this.form = form;
  }
  async handleFormSubmission(event: SubmitEvent) {
    event.preventDefault();

    // väldigt baserat på vad formen gör.
    const response = await fetch(this.form.action, {
      method: this.form.method,
      body: new FormData(this.form),
    });

    const text = await response.text();
    const html = parser.parseFromString(text, "text/html");
    const newForm = html.querySelector("form");

    if (!newForm) {
      // handle good times
      throw new Error("No form!");
      //document.querySelector("main")!.replaceWith(html.querySelector("main")!);
    } else {
      this.form.replaceWith(newForm);
      this.form = newForm;
    }
  }

  connectedCallback() {
    this.addEventListener("submit", this.handleFormSubmission.bind(this));
  }

  disconnectedCallback() {
    this.removeEventListener("submit", this.handleFormSubmission.bind(this));
  }
}

// Register the custom element if not already defined
if (!customElements.get(CrudeEnhanceForm.tagName)) {
  customElements.define(CrudeEnhanceForm.tagName, CrudeEnhanceForm);
}
