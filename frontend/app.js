import { renderStage, renderBoardTabs } from "./render.js";
import { getStages, getBoards } from "./api.js";

let currentBoardId = null;
const stagesContainer = document.querySelector('#stages-container');
const boardSelect = document.querySelector('#board-select');
const main = document.querySelector('main');

// https://stackoverflow.com/a/6211716
const addCSS = css => document.head.appendChild(document.createElement("style")).innerHTML = css;

// look for the buttons on board-select to be clicked and then change the memory's boardId
boardSelect.addEventListener('click', (e) => {
    if (e.target.tagName === "BUTTON") {
        currentBoardId = parseInt(e.target.dataset.boardId, 10);
        loadBoard(currentBoardId);
    }
})

async function loadBoard(boardId) {
    main.id = `board-${currentBoardId}`
    const stages = await getStages(boardId);
    stagesContainer.replaceChildren();
    stages.forEach((stage) => {
        stagesContainer.appendChild(renderStage(stage));
        createStageStyles(stage.id, stage.colour ?? "FFFFFF")
    })
}



function createStageStyles(stageId, colour) {
    addCSS(`#stage-${stageId} .stage-details { background-color: #${colour} }`);
}
function createBoardStyles(boardId, colour) {
    addCSS(`#board-${boardId} { background-color: #${colour} }`);
    console.log(colour)
    addCSS(`button[data-board-id="${boardId}"] { background-color: #${colour} }`);
}

async function init() {
    console.log("running...")
    const boards = await getBoards();

    if (boards.length) {
        boards.forEach((b) => createBoardStyles(b.id, b.colour ?? "FFFFFF"))
        boardSelect.appendChild(renderBoardTabs(boards));
        // in the future i want this to be stored in memory but for now the first one is fine
        currentBoardId = boards[0].id;
        await loadBoard(currentBoardId);
    } else {
        // no boards exist, revisit when board creation is wired in
    }
}

init();