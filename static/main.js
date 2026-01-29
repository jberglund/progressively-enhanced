const autoSubmitElements = document.querySelectorAll("[auto-submit]");

autoSubmitElements.forEach(function (element) {
  element.addEventListener("change", function () {
    // Find the closest form parent
    const form = element.closest("form");

    if (form) {
      form.submit();
    }
  });
});
