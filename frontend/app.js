import { renderStage, renderBoardTabs, renderHeader, renderBoardForm, renderFormTemplate, renderStageForm, renderDeleteAlert, renderTaskForm } from "./render.js";
import { getStages, getBoards, getIndividualBoard, getTasks, createBoard, updateBoard, updateStage, createStage, deleteBoard, deleteStage, createTask, getIndividualTask, updateTask, deleteTask } from "./api.js";

let currentBoardId = null;
const stagesContainer = document.querySelector('#stages-container');
const boardSelect = document.querySelector('#board-select');
const bodyTag = document.querySelector('body');


// https://stackoverflow.com/a/6211716
const addCSS = css => document.head.appendChild(document.createElement("style")).innerHTML = css;

// look for the buttons on board-select to be clicked and then change the memory's boardId
boardSelect.addEventListener('click', (e) => {
    if (e.target.tagName === "BUTTON") {
        currentBoardId = parseInt(e.target.dataset.boardId, 10);
        loadBoard(currentBoardId);
    }
});

// this does the work of loading the current board
async function loadBoard(boardId) {
    bodyTag.id = `board-${currentBoardId}`
    // then we get the actual board object
    const board = await getIndividualBoard(boardId);
    // render the header
    renderHeader(board);

    // now we're getting into the button functionality - it's basically all the same so for the sake of simplicity i will be commenting one thouroughly and the rest minimally aside from changes
    // get the button id
    const addBoard = document.querySelector("#addBoard");
    // when the button is clicked
    addBoard.addEventListener("click", (e) => {
        // this makes the form as a dialog popup
        const renderDialog = renderFormTemplate(renderBoardForm);
        bodyTag.appendChild(renderDialog);
        renderDialog.showModal();

        // this selects specificlaly the form element from the dialog
        const renderForm = renderDialog.querySelector("form");
        // on submit...
        renderForm.addEventListener("submit", async (e) => {
            // don't let it close immediately
            e.preventDefault();
            // get the data and create a new board with it
            const data = new FormData(renderForm);
            const newBoard = await createBoard({
                "board_name": data.get("title"), 
                "colour": data.get("colour").slice(1)
            });
            // and go to the new board
            await initializeBoards(newBoard.id);
            // NOW we can close it
            renderDialog.close();
        })

        // there's also a close button so on click close and don't do anything else
        renderForm.querySelector("#closeBtn").addEventListener("click", (e) => {
            renderDialog.close();
        })
    });

    // another button
    const editBoard = document.querySelector("#editBoard");
    editBoard.addEventListener("click", (e) => {
        // this one uses a parameter that is a function but the inner function has parameters so i need an anonymous function
        const renderDialog = renderFormTemplate(function() { return renderBoardForm(board); });
        bodyTag.appendChild(renderDialog);
        renderDialog.showModal();

        const renderForm = renderDialog.querySelector("form");
        renderForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = new FormData(renderForm);
            // we're updating the board instead of creating it
            const updatedBoard = await updateBoard(boardId, {
                "board_name": data.get("title"), 
                "colour": data.get("colour").slice(1)
            });
            // again, we go to the new board
            await initializeBoards(updatedBoard.id);
            renderDialog.close();
        })

        // on close, close. do nothing else.
        renderForm.querySelector("#closeBtn").addEventListener("click", (e) => {
            renderDialog.close();
        })
    });

    // this one is pretty much the same as the other two but i call a different dialog function and i don't go into form stuff.
    const boardDel = document.querySelector("#deleteBoard");
    boardDel.addEventListener("click", (e) => {
        const renderDialog = renderDeleteAlert("board", board.board_name);
        bodyTag.appendChild(renderDialog);
        renderDialog.showModal();

        renderDialog.querySelector("#closeBtn").addEventListener("click", (e) => {
            renderDialog.close();
        });

        renderDialog.querySelector("#confirmBtn").addEventListener("click", async (e) => {
            await deleteBoard(boardId);
            await initializeBoards();
            renderDialog.close();
        })
    })

    // this is the same as everything else
    const addStage = document.querySelector("#addStage");
    addStage.addEventListener("click", (e) => {
        const renderDialog = renderFormTemplate(renderStageForm);
        bodyTag.appendChild(renderDialog);
        renderDialog.showModal();

        const renderForm = renderDialog.querySelector("form");
        renderForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = new FormData(renderForm);
            await createStage(boardId, { 
                "stage_name": data.get("stage_name"), 
                "colour": data.get("colour").slice(1) 
            });
            // we're now calling loadStages because loadStages is individual board level logic
            loadStages(boardId);
            renderDialog.close();
        });

        renderForm.querySelector("#closeBtn").addEventListener("click", (e) => {
            renderDialog.close();
        })
    })

    loadStages(boardId);

}

async function loadStages(boardId) {
    // we're getting the stages for this board
    const stages = await getStages(boardId);
    // we're replacing all other stages with the current ones
    stagesContainer.replaceChildren();

    // can't use forEach with await because if i "async forEach..." it renders them out of order
    // cycle through each stage
    for (const stage of stages) {
        loadIndividualStage(stage)
    }
}

async function loadIndividualStage(stage) {
    const boardId = stage.board_id;
    // get all of the tasks within the stage
    const tasks = await getTasks(boardId, stage.id);
    // render this stage
    const stageRender = renderStage(stage, tasks);

    // more buttons! this is the same
    const editBtn = stageRender.querySelector(".editStageBtn");
    editBtn.addEventListener("click", (event) => {
        const renderDialog = renderFormTemplate(function () { return renderStageForm(stage) });
        bodyTag.appendChild(renderDialog);
        renderDialog.showModal();

        const renderForm = renderDialog.querySelector("form");
        renderForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = new FormData(renderForm);
            await updateStage(boardId, stage.id, {
                "stage_name": data.get("stage_name"), 
                "colour": data.get("colour").slice(1)
            });
            await loadStages(boardId);
            renderDialog.close();
        })

        renderForm.querySelector("#closeBtn").addEventListener("click", (e) => {
            renderDialog.close();
        })
    })

    // this is the same as delete board
    const deleteBtn = stageRender.querySelector(".deleteStageBtn");
    deleteBtn.addEventListener("click", (event) => {
        const renderDialog = renderDeleteAlert("stage", stage.stage_name);
        bodyTag.appendChild(renderDialog);
        renderDialog.showModal();

        renderDialog.querySelector("#closeBtn").addEventListener("click", (e) => {
            renderDialog.close();
        });

        renderDialog.querySelector("#confirmBtn").addEventListener("click", async (e) => {
            await deleteStage(boardId, stage.id);
            await loadStages(boardId);
            renderDialog.close();
        })
    })

    // yet another button
    const addTaskBtn = stageRender.querySelector(".addTaskBtn");
    addTaskBtn.addEventListener("click", (event) => {
        const renderDialog = renderFormTemplate(renderTaskForm);
        bodyTag.appendChild(renderDialog);
        renderDialog.showModal();

        const renderForm = renderDialog.querySelector("form");
        renderForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = new FormData(renderForm);
            await createTask(boardId, stage.id, {
                "title": data.get("title"),
                // this is slightly different - we're allowing things to be null
                "task_description": data.get("task_description") || null,
                "deadline": data.get("deadline") || null
                // add parent_task_id and recurring_template_id later
            });
            await loadStages(boardId);
            renderDialog.close();
        })

        renderForm.querySelector("#closeBtn").addEventListener("click", (e) => {
            renderDialog.close();
        })
    })
    stagesContainer.append(stageRender);
    createStageStyles(stage.id, stage.colour ?? "FFFFFF");


    // more buttons
    const editTaskBtns = document.querySelectorAll(`#stage-${stage.id} .editTask`);
    editTaskBtns.forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const task = await getIndividualTask(boardId, stage.id, parseInt(e.target.dataset.taskId, 10));
            const renderDialog = renderFormTemplate( function() { return renderTaskForm(task) } );
            bodyTag.appendChild(renderDialog);
            renderDialog.showModal();

            const renderForm = renderDialog.querySelector("form");
            renderForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const data = new FormData(renderForm);
                await updateTask(boardId, stage.id, task.id, {
                    "title": data.get("title"),
                    "task_description": data.get("task_description") || null,
                    "deadline": data.get("deadline") || null,
                    // instead of defauling to null, we default to false if the checkbox is unchecked (which makes sense, because that's the completion checkbox)
                    "is_complete": data.get("is_complete") || false
                })

                await loadStages(boardId);

                renderDialog.close();
            })

            renderForm.querySelector("#closeBtn").addEventListener("click", (e) => {
                renderDialog.close();
            })
        })
    });

    // even more buttons
    const deleteTaskBtns = document.querySelectorAll(`#stage-${stage.id} .deleteTask`);
    deleteTaskBtns.forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const task = await getIndividualTask(boardId, stage.id, parseInt(e.target.dataset.taskId, 10));
            const renderDialog = renderDeleteAlert("task", task.title);
            bodyTag.appendChild(renderDialog);
            renderDialog.showModal();

            renderDialog.querySelector("#closeBtn").addEventListener("click", (e) => {
                renderDialog.close();
            });

            renderDialog.querySelector("#confirmBtn").addEventListener("click", async (e) => {
                await deleteTask(boardId, stage.id, task.id);
                await loadStages(boardId);
                renderDialog.close();
            })
        })
    });

    // this is slightly different - it looks for checks within each stage (otherwise they event listener will repeat itself) and then updates the task
    const finishTaskChecks = document.querySelectorAll(`#stage-${stage.id} .finishTask`);
    finishTaskChecks.forEach(check => {
        // change listener instead of click
        check.addEventListener("change", async (e) => {
            // update the task specifically with the is_complete, completed_at updates itself
            const task = await updateTask(boardId, stage.id, parseInt(e.target.dataset.taskId, 10), {
                is_complete: e.target.checked
            });

            // select the task element and add a finished class to it (for css styling)
            const taskElement = document.querySelector(`#task-${task.id}`);
            if (e.target.checked) taskElement.classList.add("finished");
            else taskElement.classList.remove("finished");
        })
    })
}

// these are just css styling
function createStageStyles(stageId, colour) {
    // i learned contrast-color just for this! it just decides for me whether black or white provide better contrast
    addCSS(`#stage-${stageId} { color: contrast-color(#${colour}) }`)
    addCSS(`#stage-${stageId} .stage-details { background-color: #${colour}; color: contrast-color(#${colour}) }`);
}

function createBoardStyles(boardId, colour) {
    addCSS(`#board-${boardId} { background-color: #${colour}; color: contrast-color(#${colour})  }`);
    addCSS(`button[data-board-id="${boardId}"] { background-color: #${colour}; color: contrast-color(#${colour}) }`);
    addCSS(`button[data-board-id="${boardId}"]:hover, button[data-board-id="${boardId}"]:active { background-color: color-mix(in srgb, #${colour} 60%, black) `)
}

// initialize boards: just a nice function that lets everything start up
// it could be in init but whatever
async function initializeBoards(currentBoard = null) {
    const boards = await getBoards();

    if (boards.length) {
        boards.forEach((b) => createBoardStyles(b.id, b.colour ?? "FFF"));
        boardSelect.replaceChildren(renderBoardTabs(boards));
        currentBoardId = currentBoard ?? boards[0].id;
        await loadBoard(currentBoardId);
    } else {
        console.log("no boards is a to-do item");
    }
}

async function init() {
    console.log("running...")

    initializeBoards();
}

init();