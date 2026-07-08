function renderBoardTabs(boards) {
    const newDiv = document.createElement("div")

    boards.forEach((board) => {
        const btn = document.createElement("button");
        btn.dataset.boardId = board.id;
        btn.textContent = board.board_name;
        newDiv.appendChild(btn);
    })

    return newDiv;
}

function renderStage(stageData) {
    const stage = document.createElement("div");
    stage.classList.add("stage");
    stage.id = `stage-${stageData.id}`;
    stage.dataset.stageId = stageData.id;
    
    const stageDetails = document.createElement("div");
    stageDetails.classList.add("stage-details");
    const stageName = document.createElement("h2");
    stageName.textContent = stageData.stage_name;
    const taskCount = document.createElement("p");
    taskCount.textContent = "Task count goes here";
    stageDetails.appendChild(stageName);
    stageDetails.appendChild(taskCount);
    stage.append(stageDetails);

    const stageContent = document.createElement("div");
    stageContent.classList.add("stage-content");
    stage.append(stageContent)

    return stage
}

function renderHeader(board) {
    const header = document.querySelector("header");
    header.replaceChildren()

    const h1 = document.createElement("h1");
    h1.textContent = board.board_name;
    header.appendChild(h1);

    return header;
}

export { 
    renderBoardTabs,
    renderStage,
    renderHeader
}