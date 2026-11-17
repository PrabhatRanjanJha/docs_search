function buildIndex() {
    const index = [];

    const headings = document.querySelectorAll("h1, h2, h3, h4");

    headings.forEach(h => {
        if (!!h.closest("aside, .article-footer__inner")) return;
        if (!h.textContent?.trim()) return;

        index.push({
            type: "heading",
            text: h.textContent.trim(),
            element: h
        });
    });

    const links = document.querySelectorAll(".left-sidebar__content a");

    links.forEach(link => {
        const text = link.textContent.trim();
        if (!text) return;

        const parts = new URL(link.href).pathname.split("/");
        const i = parts.indexOf("Global_Objects");
        const after = i === -1 ? [] : parts.slice(i + 1);
        const context = after.length === 2 ? after[0] : "";

        index.push({
            type: "link",
            text,
            href: link.href,
            context
        });
    });

    return index;
}


//Variables
let currentIndex = [];

// Create the extension container
const host = document.createElement("div");
const body = document.querySelector("body");

body.appendChild(host);

const miniDoc = host.attachShadow({ mode: "open" });


// Create the search box
const box = document.createElement("div");
miniDoc.appendChild(box);

const inputEle = document.createElement("input");
inputEle.placeholder = "Search this page...";
box.appendChild(inputEle);

const results = document.createElement("div")
box.appendChild(results)

// Style the search box
box.style.display = "none";
box.style.flexDirection = "column";
box.style.justifyContent = "flex-start";
box.style.alignItems = "stretch";
box.style.position = "fixed";
box.style.top = "10px";
box.style.right = "10px";
box.style.zIndex = "999999";
box.style.color = "black";
box.style.backgroundColor = "white";
box.style.border = "2px solid black";
box.style.padding = "10px";
box.style.width = "400px";
box.style.boxSizing = "border-box";


// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
    if (e.shiftKey && e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        box.style.display = "flex";
        inputEle.focus();
        currentIndex = buildIndex();

        // console.log("shortcut pressed");

    } else if (e.key === "Escape") {
        box.style.display = "none";
    }
});


//helper render function
function renderResults(matches) {
    results.textContent = "";

    if (matches.length === 0) {
        results.textContent = "No matches";
        return;
    }

    matches.forEach(item => {
        const row = document.createElement("div");

        const label = item.type === "heading" ? "On this page" : "Opens new page";

        const search = item.context ? `${item.context}, ${item.text}` : item.text;

        row.textContent = `${label}, ${search}`;

        row.style.cursor = "pointer";
        row.style.padding = "5px";

        row.addEventListener("click", () => {
            if (item.type === "heading") {
                const oldB = item.element.style.backgroundColor;
                const oldT = item.element.style.color;

                item.element.style.transition = "background-color 0.5s ease, color 0.5s ease";

                item.element.style.scrollMarginTop = "100px";

                item.element.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
                
                item.element.style.backgroundColor = "lightyellow";
                item.element.style.color = "black";

                setTimeout(()=> {
                    item.element.style.backgroundColor = oldB;
                    item.element.style.color = oldT;
                }, 1500)

            } else {
                window.location.href = item.href;
            }

        });

        results.appendChild(row);
    });
}


inputEle.addEventListener("input", ()=>{
    let query = inputEle.value.trim().toLowerCase();

    if (!query) {
        results.textContent = "";
        return;
    }

    const matches = currentIndex.filter(item => item.text.toLowerCase().includes(query)).slice(0, 8);

    renderResults(matches);

        
})