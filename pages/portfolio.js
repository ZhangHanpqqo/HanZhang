const portfolioItems = [
    {
        index: 0,
        title: "Learning to Move, Learning to Play, Learning to Animate",
        category: "Art",
        shortLabel: "Project page",
        description: "Performance and installation work from 2024.",
        image: "../assets/img_art/learn2move.jpg",
        links: [
            { label: "Open project", href: "./art/L2M.html" }
        ],
        associate: []
    },
    {
        index: 1,
        title: "De-dimension",
        category: "Art",
        shortLabel: "Project page",
        description: "2025 work by āññā duo.",
        image: "../assets/img_art/dedim.jpeg",
        links: [
            { label: "Open project", href: "https://annaduo.pro/pages/ddm.html" }
        ],
        associate: []
    },
    {
        index: 2,
        title: "no_input_dev",
        category: "Art",
        shortLabel: "Project page",
        description: "Ongoing project beginning in 2025.",
        image: "../assets/img_art/no_input_dev.jpg",
        links: [
            { label: "Open project", href: "./art/tam.html" }
        ],
        associate: []
    },
    {
        index: 3,
        title: "Radio Projects",
        category: "Art / Audio",
        shortLabel: "Me Hiciste Falta, nobody thus everybody floating in the air",
        description: "Combined entry for radio-oriented works including Me Hiciste Falta and nobody thus everybody floating in the air.",
        image: "../assets/img_art/ems.jpg",
        links: [
            { label: "Me Hiciste Falta", href: "./art/falta.html" },
            { label: "nobody thus everybody floating in the air", href: "./art/floating.html" }
        ],
        associate: []
    },
    {
        index: 4,
        title: "Timbre Analysis and Synthesis",
        category: "Research",
        shortLabel: "Documentation, Slides, Video",
        description: "Research on interpretable parameters for musical timbre analysis and synthesis.",
        image: "../assets/img_art/tpwi.jpg",
        links: [
            { label: "Documentation", href: "../old/assets/Interpretable_Parameters_for_Musical_Timbre_Analysis_and_Synthesis.pdf" },
            { label: "Slides", href: "../old/assets/HanZhangThesis.pdf" },
            { label: "Video", href: "https://youtu.be/vZbmQH_yO5g" }
        ],
        associate: [5]
    },
    {
        index: 5,
        title: "Computer-assisted Orchestration and Texture Generation",
        category: "Research",
        shortLabel: "Slides",
        description: "Work on orchestration support and algorithmic texture generation.",
        image: "../assets/img_art/bio_artist.JPG",
        links: [
            { label: "Slides", href: "../old/assets/overall-auto-orchestration.pdf" }
        ],
        associate: [4]
    }
];

const state = {
    selectedIndex: null,
    hoverIndex: null
};

const listEl = document.getElementById("portfolio-list");
const panelEl = document.getElementById("portfolio-panel");
const detailEl = document.getElementById("portfolio-detail");
const layoutSeed = [0.31, 0.66, 0.44, 0.73, 0.58, 0.27, 0.62, 0.41, 0.79, 0.36];

function randFromSeed(step) {
    return layoutSeed[step % layoutSeed.length];
}

function getStageHeight() {
    return Math.max(window.innerHeight, 680);
}

function getTargetLeafCount(width, height) {
    const areaBasedCount = Math.round((width * height) / 42000);
    return Math.max(portfolioItems.length + 8, Math.min(areaBasedCount, portfolioItems.length + 18));
}

function createMondrianBlocks(width, height) {
    const blocks = [];
    const paddingX = Math.max(40, Math.floor(width * 0.1));
    const paddingY = Math.max(40, Math.floor(height * 0.1));
    const minBlockWidth = Math.max(120, Math.floor(width * 0.16));
    const minBlockHeight = Math.max(120, Math.floor(height * 0.16));
    const targetLeafCount = getTargetLeafCount(width, height);

    function split(rect, step) {
        if (blocks.length >= targetLeafCount - 1) {
            blocks.push(rect);
            return;
        }

        const tooSmall = rect.width < paddingX * 2 || rect.height < paddingY * 2;
        const belowMinimumSize = rect.width < minBlockWidth * 2 || rect.height < minBlockHeight * 2;
        if (tooSmall) {
            blocks.push(rect);
            return;
        }

        if (belowMinimumSize) {
            blocks.push(rect);
            return;
        }

        const useVertical = rect.width > rect.height;
        const ratio = 0.32 + randFromSeed(step) * 0.36;

        if (useVertical) {
            const splitX = Math.floor(rect.x + paddingX + (rect.width - paddingX * 2) * ratio);
            split({ x: rect.x, y: rect.y, width: splitX - rect.x, height: rect.height }, step + 1);
            split({ x: splitX, y: rect.y, width: rect.x + rect.width - splitX, height: rect.height }, step + 2);
            return;
        }

        const splitY = Math.floor(rect.y + paddingY + (rect.height - paddingY * 2) * ratio);
        split({ x: rect.x, y: rect.y, width: rect.width, height: splitY - rect.y }, step + 1);
        split({ x: rect.x, y: splitY, width: rect.width, height: rect.y + rect.height - splitY }, step + 2);
    }

    split({ x: 0, y: 0, width, height }, 0);

    return blocks
        .sort((a, b) => (b.width * b.height) - (a.width * a.height));
}

function createPortfolioBlocks() {
    const fragment = document.createDocumentFragment();
    const width = listEl.clientWidth || listEl.parentElement.clientWidth;
    const height = getStageHeight();
    const layoutBlocks = createMondrianBlocks(width, height);

    listEl.style.height = `${height}px`;

    layoutBlocks.forEach((rect, itemIndex) => {
        const block = document.createElement("article");
        block.className = "block";
        block.style.left = `${rect.x}px`;
        block.style.top = `${rect.y}px`;
        block.style.width = `${Math.max(rect.width, 120)}px`;
        block.style.height = `${Math.max(rect.height, 120)}px`;

        const item = portfolioItems[itemIndex];
        if (!item) {
            block.classList.add("is-filler");
            block.setAttribute("aria-hidden", "true");
            fragment.appendChild(block);
            return;
        }

        block.dataset.index = item.index;
        block.tabIndex = 0;
        block.style.backgroundImage = `url("${item.image}")`;

        const category = document.createElement("div");
        category.className = "block-category";
        category.textContent = item.category;

        const title = document.createElement("h3");
        title.className = "block-title";
        title.textContent = item.title;

        const links = document.createElement("div");
        links.className = "block-links";
        links.textContent = item.shortLabel;

        block.append(category, title, links);

        block.addEventListener("mouseenter", () => {
            state.hoverIndex = item.index;
            renderActiveState();
            renderDetail(item.index, false);
        });

        block.addEventListener("mouseleave", () => {
            state.hoverIndex = null;
            renderActiveState();
            renderDetail(state.selectedIndex, true);
        });

        block.addEventListener("click", () => {
            state.selectedIndex = item.index;
            renderActiveState();
            renderDetail(item.index, true);
        });

        block.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                state.selectedIndex = item.index;
                renderActiveState();
                renderDetail(item.index, true);
            }
        });

        fragment.appendChild(block);
    });

    listEl.replaceChildren(fragment);
}

function renderActiveState() {
    const focusIndex = state.hoverIndex ?? state.selectedIndex;
    const activeItem = portfolioItems.find((item) => item.index === focusIndex);
    const related = new Set(activeItem?.associate ?? []);

    listEl.querySelectorAll(".block").forEach((block) => {
        const index = Number(block.dataset.index);
        block.classList.toggle("is-active", index === focusIndex);
        block.classList.toggle("is-related", related.has(index));
    });
}

function renderDetail(index, persistSelection) {
    const activeIndex = index ?? state.selectedIndex;

    if (activeIndex == null) {
        panelEl.style.setProperty("--detail-bg-image", "none");
        detailEl.innerHTML = '<p class="detail-empty">Select a project to view details.</p>';
        return;
    }

    const item = portfolioItems.find((entry) => entry.index === activeIndex);
    if (!item) {
        panelEl.style.setProperty("--detail-bg-image", "none");
        detailEl.innerHTML = '<p class="detail-empty">Project details are unavailable.</p>';
        return;
    }

    const backgroundItem = portfolioItems.find((entry) => entry.index === state.selectedIndex) ?? item;
    panelEl.style.setProperty("--detail-bg-image", `url("${backgroundItem.image}")`);

    detailEl.replaceChildren();

    const category = document.createElement("div");
    category.className = "detail-category";
    category.textContent = persistSelection ? `${item.category} selected` : `${item.category} preview`;

    const title = document.createElement("h2");
    title.textContent = item.title;

    const description = document.createElement("p");
    description.className = "detail-description";
    description.textContent = item.description;

    const links = document.createElement("div");
    links.className = "detail-links";

    item.links.forEach((link) => {
        const anchor = document.createElement("a");
        anchor.href = link.href;
        anchor.textContent = link.label;
        anchor.target = link.href.startsWith("http") ? "_blank" : "_self";
        if (anchor.target === "_blank") {
            anchor.rel = "noreferrer noopener";
        }
        links.appendChild(anchor);
    });

    detailEl.append(category, title, description, links);

    if (item.associate.length > 0) {
        const relatedTitle = document.createElement("p");
        relatedTitle.textContent = "Related";

        const relatedList = document.createElement("ul");
        relatedList.className = "detail-related";

        item.associate
            .map((relatedIndex) => portfolioItems.find((entry) => entry.index === relatedIndex))
            .filter(Boolean)
            .forEach((relatedItem) => {
                const li = document.createElement("li");
                const button = document.createElement("button");
                button.type = "button";
                button.textContent = relatedItem.title;
                button.addEventListener("click", () => {
                    state.selectedIndex = relatedItem.index;
                    renderActiveState();
                    renderDetail(relatedItem.index, true);
                });
                li.appendChild(button);
                relatedList.appendChild(li);
            });

        detailEl.append(relatedTitle, relatedList);
    }

}


let resizeFrame = null;

window.addEventListener("resize", () => {
    if (resizeFrame) {
        cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = requestAnimationFrame(() => {
        createPortfolioBlocks();
        renderActiveState();
    });
});

createPortfolioBlocks();
state.selectedIndex = portfolioItems[0]?.index ?? null;
renderActiveState();
renderDetail(state.selectedIndex, true);
