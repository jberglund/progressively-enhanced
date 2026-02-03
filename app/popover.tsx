import { Style, css } from "hono/css";

export const PopoverPage = ({}: {}) => {
  return (
    <div>
      <Style>{css`
        #my-popover {
          position-area: bottom;
          max-width: 30ch;
          border: none;
          background-color: #f0f0f0;

          opacity: 1;
          transform: scale(1);
          transition: all 300ms ease;

          padding: 0.5rem;
        }
        #my-popover:popover-open {
          opacity: 1;
          transform: scale(1);
        }

        @starting-style {
          #my-popover {
            opacity: 0;
            transform: scale(0.98);
          }
        }
      `}</Style>

      <div id="my-popover" popover>
        <h4>A popover for the ages</h4>
        <p>
          Ah, twas a beatiful day, was it not? The wind, the gentle swaying of
          botanicals.
        </p>
      </div>
      <flex-stack horizontal gap="m">
        <button class="button" popovertarget="my-popover">
          Toggle
        </button>
        <button
          class="button"
          popovertarget="my-popover"
          popovertargetaction="show"
        >
          Show
        </button>
        <button
          class="button"
          popovertarget="my-popover"
          popovertargetaction="hide"
        >
          Hide
        </button>
      </flex-stack>
    </div>
  );
};
