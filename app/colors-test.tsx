export function ColorsTest() {
  const palettes = ["neutral", "accent", "success", "error"] as const;
  const steps = [
    "50",
    "100",
    "150",
    "200",
    "250",
    "300",
    "350",
    "400",
    "450",
    "500",
    "550",
    "600",
    "650",
    "700",
    "750",
    "800",
    "850",
    "900",
    "950",
  ];

  return (
    <flex-stack gap="xl">
      <h1>Color System Test</h1>

      {/* Raw palette swatches */}
      <section>
        <h2 class="mb-m">Palette Swatches</h2>
        <flex-stack gap="l">
          {palettes.map((palette) => (
            <div data-palette={palette}>
              <h3 class="mb-s">{palette}</h3>
              <flex-stack horizontal="start" gap="2xs" nowrap>
                {steps.map((step) => (
                  <div
                    style={{
                      backgroundColor: `var(--palette-${step})`,
                      width: "3rem",
                      height: "3rem",
                    }}
                    title={`--palette-${step}`}
                  >
                    <span
                      class="text-xs"
                      style={{
                        color:
                          parseInt(step) < 500
                            ? "var(--palette-900)"
                            : "var(--palette-100)",
                      }}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </flex-stack>
            </div>
          ))}
        </flex-stack>
      </section>

      {/* Semantic tokens — regular */}
      <section class="p-xl bg-subtle fg-default">
        <h2 class="mb-xl">Semantic Tokens — Regular</h2>
        <flex-stack horizontal="start" gap="l">
          {palettes.map((palette) => (
            <flex-stack
              data-palette={palette}
              gap="s"
              style={{ width: "12rem" }}
            >
              <h3>{palette}</h3>

              <div class="bg-subtle p-m border bc-subtle">
                <p class="fg-default">bg-subtle</p>
                <p class="fg-subtle text-s">fg-subtle / bc-subtle</p>
              </div>

              <div class="bg-default p-m border bc-default">
                <p class="fg-default">bg-default</p>
                <p class="fg-subtle text-s">fg-subtle / bc-default</p>
              </div>

              <div class="bg-strong p-m border bc-strong">
                <p class="fg-strong">bg-strong</p>
                <p class="fg-default text-s">fg-default / bc-strong</p>
              </div>
            </flex-stack>
          ))}
        </flex-stack>
      </section>

      {/* Semantic tokens — inverted */}
      <section class="p-xl bg-subtle fg-default" data-palette-inverted>
        <h2 class="mb-xl">Semantic Tokens — Inverted</h2>
        <flex-stack horizontal="start" gap="l">
          {palettes.map((palette) => (
            <flex-stack
              data-palette={palette}
              data-palette-inverted
              gap="s"
              style={{ width: "12rem" }}
            >
              <h3 class="fg-default">{palette}</h3>

              <div class="bg-subtle p-m border bc-subtle">
                <p class="fg-default">bg-subtle</p>
                <p class="fg-subtle text-s">fg-subtle / bc-subtle</p>
              </div>

              <div class="bg-default p-m border bc-default">
                <p class="fg-default">bg-default</p>
                <p class="fg-subtle text-s">fg-subtle / bc-default</p>
              </div>

              <div class="bg-strong p-m border bc-strong">
                <p class="fg-strong">bg-strong</p>
                <p class="fg-default text-s">fg-default / bc-strong</p>
              </div>
            </flex-stack>
          ))}
        </flex-stack>
      </section>

      {/* Contrast combinations */}
      <section>
        <h2 class="mb-m">Contrast Combinations</h2>
        <flex-stack horizontal="start" gap="l">
          {palettes.map((palette) => (
            <flex-stack
              data-palette={palette}
              gap="s"
              style={{ width: "14rem" }}
            >
              <h3>{palette}</h3>
              <table class="w-full" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr class="bg-strong">
                    <th class="p-xs fg-strong text-left">bg</th>
                    <th class="p-xs fg-strong text-left">fg</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="bg-subtle">
                    <td class="p-xs fg-default">subtle</td>
                    <td class="p-xs fg-default">default ✓</td>
                  </tr>
                  <tr class="bg-subtle">
                    <td class="p-xs fg-strong">subtle</td>
                    <td class="p-xs fg-strong">strong ✓</td>
                  </tr>
                  <tr class="bg-default">
                    <td class="p-xs fg-default">default</td>
                    <td class="p-xs fg-default">default ✓</td>
                  </tr>
                  <tr class="bg-default">
                    <td class="p-xs fg-strong">default</td>
                    <td class="p-xs fg-strong">strong ✓</td>
                  </tr>
                  <tr class="bg-strong">
                    <td class="p-xs fg-strong">strong</td>
                    <td class="p-xs fg-strong">strong ✓</td>
                  </tr>
                  <tr class="bg-subtle">
                    <td class="p-xs fg-subtle">subtle</td>
                    <td class="p-xs fg-subtle">subtle ?</td>
                  </tr>
                </tbody>
              </table>
            </flex-stack>
          ))}
        </flex-stack>
      </section>
    </flex-stack>
  );
}
