// returns all tabs satisfying query's conditions
const tabs = await chrome.tabs.query({
    url: [
        "https://developer.chrome.com/docs/webstore/*",
        "https://developer.chrome.com/docs/extensions/*"
    ]
});

// multi-language text aligner
const collator = new Intl.Collator();
tabs.sort((a, b) => collator.compare(a.title, b.title));

// template tag is not shown normally but clone template object through javascript
const template = document.getElementById("li_template");
const elements = new Set(); // Same as python's set()
for (const tab of tabs) {
    // make a new element from template
    const element = template.content.firstElementChild.cloneNode(true);

    const title = tab.title.split("-")[0].trim();
    // pathname = the name comes after the hostname(xxxx.com)
    const pathname = new URL(tab.url).pathname.slice("/docs".length);

    element.querySelector(".title").textContent = title;
    element.querySelector(".pathname").textContent = pathname;
    element.querySelector("a").addEventListener("click", async () => {
        // need to focus window as well as the active tab
        await chrome.tabs.update(tab.id, { active: true });
        await chrome.windows.update(tab.windowId, { focused: true });
    });

    elements.add(element);
}

document.querySelector("ul").append(...elements);

const button = document.querySelector("button");
button.addEventListener("click", async () => {
    const tabIds = tabs.map(({ id }) => id);
    if (tabIds.length) {
        const group = await chrome.tabs.group({ tabIds });
        // update a chrome's group tab
        await chrome.tabGroups.update(group, { title: "DOCS" });
    }
})