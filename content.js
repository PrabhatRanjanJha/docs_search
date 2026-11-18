const SITE_CONFIG = {
    "developer.mozilla.org": {
        sidebar: ".left-sidebar__content a",
        ignore: "aside, .article-footer__inner",
        scrollOffset: 100
    },
    "www.w3schools.com": {
        sidebar: "#leftmenuinnerinner a",
        ignore: [
            ".tutnav-wrap",
            ".refnav-wrap",
            ".exnav-main-heading",
            ".certnav-wrap",
            ".ws-cert-flex",
            ".advb-inner",
            ".ws-hide-on-logged-in",
            "#err_message"
        ].join(", "),
        scrollOffset: 100
    }
};

const DEFAULT_CONFIG = {
    sidebar: "nav a",
    ignore: "nav, footer, header, aside",
    scrollOffset: 80
};

const config = SITE_CONFIG[location.hostname] || DEFAULT_CONFIG;

//Variables
let currentIndex = [];
let currentMatches = [];
let selectedIndex = 0;

let fuse = null;


function buildIndex() {
    const index = [];

    const headings = document.querySelectorAll("h1, h2, h3, h4");

    headings.forEach(h => {
        if (!!h.closest(config.ignore)) return;
        if (!h.textContent?.trim()) return;

        index.push({
            type: "heading",
            text: h.textContent.trim(),
            element: h
        });
    });

    const links = document.querySelectorAll(config.sidebar);

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
        fuse = new Fuse(currentIndex, {
            keys: ["text", "context"],
            threshold: 0.4
        })
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

    matches.forEach((item, position) => {
        const row = document.createElement("div");

        const label = item.type === "heading" ? "On this page" : "Opens new page";

        const search = item.context ? `${item.context}, ${item.text}` : item.text;

        row.textContent = `${label}, ${search}`;

        row.style.cursor = "pointer";
        row.style.padding = "5px";

        row.addEventListener("click", () => {
            selectedIndex = position;
            renderResults(currentMatches);
            openEle(item);
            inputEle.focus();
        });

        if (position === selectedIndex) {
            row.style.backgroundColor = "#e0e7ff";   // light blue
        }

        results.appendChild(row);
    });
}


inputEle.addEventListener("input", ()=>{
    let query = inputEle.value.trim().toLowerCase();

    if (!query) {
        results.textContent = "";
        currentMatches = [];
        selectedIndex = 0;
        return;
    }

    const matches = fuse.search(query).slice(0, 8).map(r=> r.item)
    currentMatches = matches;
    selectedIndex = 0;

    inputEle.focus();
    return renderResults(currentMatches);
})

inputEle.addEventListener("keydown", (e)=>{
    if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, currentMatches.length-1);
        return renderResults(currentMatches);
    }     

    if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        return renderResults(currentMatches);
    }

    if (e.key === "Enter") {
        e.preventDefault();
        if (currentMatches.length === 0) { return; }
        return openEle(currentMatches[selectedIndex])
    }
})

function openEle(item) {
    if (item.type === "heading") {
        const oldB = item.element.style.backgroundColor;
        const oldT = item.element.style.color;

        item.element.style.transition = "background-color 0.5s ease, color 0.5s ease";

        item.element.style.scrollMarginTop = `${config.scrollOffset}px`;

        item.element.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
        
        item.element.style.backgroundColor = "lightyellow";
        item.element.style.color = "black";

        setTimeout(()=> {
            item.element.style.backgroundColor = oldB;
            item.element.style.color = oldT;
            item.element.style.transition = "";
        }, 1500)

    } else {
        window.location.href = item.href;
    }

}