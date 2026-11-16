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
        if (!link.textContent?.trim()) {return;}

        index.push({"type": "link", "text": link.textContent.trim(), "href": link.href})
    })

    return index;
}

console.log(buildIndex())