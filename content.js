function buildIndex() {
    const index = [];

    const headings = document.querySelectorAll("h1, h2, h3, h4")
    headings.forEach(h => {
        if (!!h.closest("aside, .article-footer__inner")) {return;}
        
        if (!h.textContent?.trim()) {return;}

        index.push({"type": "heading", "text": h.textContent.trim(), "element": h})
    })

    const links = document.querySelectorAll(".left-sidebar__content a")

    links.forEach(link => {
        const text = link.textContent.trim();
        if (!text) return;

        const parts = new URL(link.href).pathname.split("/");
        const i = parts.indexOf("Global_Objects");
        const after = i === -1 ? [] : parts.slice(i + 1);
        const context = after.length === 2 ? after[0] : "";

        index.push({ type: "link", text, href: link.href, context });
    })

    return index;
}

console.log(buildIndex())