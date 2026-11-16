function buildIndex() {
    const index = [];

    const headings = document.querySelectorAll("h1, h2, h3, h4")
    headings.forEach(h => {
        if (!!h.closest("aside, .article-footer__inner")) {return;}
        
        if (!h.textContent?.trim()) {return;}

        index.push({"type": "heading", "text": h.textContent.trim(), "element": h})
    })

    return index;
}

console.log(buildIndex())