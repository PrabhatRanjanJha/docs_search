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

const host = document.createElement("div")
const body = document.querySelector("body")
body.appendChild(host)

const miniDoc = host.attachShadow({mode: "open"})
const box = document.createElement("div")
const inputEle = document.createElement("input")
inputEle.placeholder = "Search this page..."
box.appendChild(inputEle)
miniDoc.appendChild(box)
box.style.display = "none"
box.style.justifyContent = "end"
box.style.alignItems = "center"
box.style.position = "fixed"
box.style.top = "10px"
box.style.right = "10px"
box.style.zIndex = "999999"
box.style.color = "black"
box.style.backgroundColor = "white"
box.style.border = "2px solid black"
box.style.padding = "10px"

document.addEventListener("keydown", (e)=>{
    if (e.shiftKey && e.ctrlKey && e.key.toLowerCase()==="k") {
        e.preventDefault();
        if (box.style.display === "flex") { box.style.display = "none"; }
        else { 
            box.style.display = "flex"; 
            inputEle.focus()
        }
        // console.log("shortcut pressed");
    } else if (e.key === "Escape") {box.style.display = "none";}
})

// console.log(buildIndex())