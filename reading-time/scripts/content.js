function renderReadingTime(article) {
    // If article is not found, skip rendering
    if (!article) {
        return;
    }

    const text = article.textContent;
    const wordMatchRegExp = /[^\s]+/g; // regular expression
    const words = text.matchAll(wordMatchRegExp);
    const wordCount = [...words].length;
    const readingTime = Math.round(wordCount / 200);

    const badge = document.createElement("p");
    badge.classList.add("color-secondary-text", "type--caption"); // consist page's style
    badge.textContent = `Rendered from MyExtension ⏱️ ${readingTime} min read`;

    const heading = article.querySelector("h1");
    const date = article.querySelector("time")?.parentNode;

    // nullish coalescing
    // returns default value(after double-question mark) when front value is null or undefined.
    (date ?? heading).insertAdjacentElement("afterend", badge);
}

renderReadingTime(document.querySelector("article"));

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node instanceof Element && node.tagName == "ARTICLE") {
                renderReadingTime(node);
            }
        }
    }
});

observer.observe(document.querySelector('devsite-content'), {
    childList: true
});