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

function renderStage(stageData, tasks) {
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
    tasks.forEach((task) => stageContent.append(renderTask(task)))
    stage.append(stageContent)

    return stage
}

function renderHeader(board) {
    const header = document.querySelector("header");
    header.replaceChildren()

    const h1 = document.createElement("h1");
    h1.textContent = board.board_name;
    header.appendChild(h1);

    const addBoard = document.createElement("button");
    addBoard.textContent = "Add board";
    addBoard.id = "addBoard";
    header.appendChild(addBoard);

    const editBoard = document.createElement("button");
    editBoard.textContent = "Edit board";
    editBoard.id = "editBoard";
    header.appendChild(editBoard);

    return header;
}

function renderTask(task) {
    console.log(task)
    const taskContainer = document.createElement("div");
    taskContainer.id = `task-${task.id}`;
    if (task.is_complete) taskContainer.classList.add("finished");
    task.parent_task_id ? taskContainer.classList.add("subtask") : taskContainer.classList.add("task")
    
    const taskName = document.createElement("h2");
    taskName.textContent = task.title;
    taskContainer.appendChild(taskName);

    // this is for m4
    const tagContainer = document.createElement("div");
    tagContainer.classList.add("tags");
    taskContainer.appendChild(tagContainer);

    // this is for m8
    if (task.deadline) {
        const deadline = document.createElement("p");
        // i'll need a helper function that parses this nicely, plus something to calculate days, but that's a future milestone
        deadline.textContent = task.deadline;
        taskContainer.append(deadline);
    }

    if (task.task_description) {
        const description = document.createElement("p");
        description.textContent = task.task_description;
        taskContainer.appendChild(description);
    }

    // this is for m9
    if (task.recurring_template_id) {
        const recurrance = document.createElement("p");
        recurrance.textContent = "Recurrs...";
        taskContainer.appendChild(recurrance);
    }

    return taskContainer
}

function renderFormTemplate(renderFormContent) {
    const dialog = document.createElement("dialog");
    const form = document.createElement("form");
    form.method = "dialog";
    
    const content = renderFormContent();
    console.log(content);
    form.appendChild(content)

    const formActions = document.createElement("div");
    formActions.classList.add("form-actions")
    
    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.id = "closeBtn";
    cancelBtn.textContent = "Cancel"

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Submit"

    formActions.appendChild(cancelBtn);
    formActions.appendChild(submitBtn);
    form.appendChild(formActions);

    dialog.append(form);

    return dialog;
}

function renderBoardForm(board = null) {
    console.log(board);

    const container = document.createElement("div")

    const titleLabel = document.createElement("label");
    titleLabel.htmlFor = "title";
    titleLabel.textContent = "Title: "
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "title";
    titleInput.name = "title";
    titleInput.required = true;
    // "board?" means "don't throw me an error if there isn't a board while checking to see if there's a title on the board"
    // so basically: if no board return "", if yes board return title unless there isn't one then ""
    titleInput.value = board?.board_name ?? "";
    console.log(board?.title);
    
    container.appendChild(titleLabel);
    container.appendChild(titleInput);

    const colourPickerLabel = document.createElement("label");
    colourPickerLabel.htmlFor = "colour";
    colourPickerLabel.textContent = "Board colour: ";
    const colourPickerInput = document.createElement("input");
    colourPickerInput.name = "colour";
    colourPickerInput.id = "colour"
    colourPickerInput.type = "color";
    colourPickerInput.value = `#${board?.colour ?? "FFFFFF"}`

    container.appendChild(colourPickerLabel);
    container.appendChild(colourPickerInput);

    return container
}

function renderStageForm(stage = null) {
    const container = document.createElement("div");

    const nameLabel = document.createElement("label");
    nameLabel.htmlFor = "stage_name";
    nameLabel.textContent = "Name: ";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "stage_name"
    nameInput.id = "stage_name";
    nameInput.required = true;
    nameInput.value = stage?.stage_name ?? "";

    container.appendChild(nameLabel);
    container.appendChild(nameInput);

    const colourPickerLabel = document.createElement("label");
    colourPickerLabel.htmlFor = "colour";
    colourPickerLabel.textContent = "Section colour: ";
    const colourPickerInput = document.createElement("input");
    colourPickerInput.name = "colour";
    colourPickerInput.id = "colour"
    colourPickerInput.type = "color";
    colourPickerInput.value = `#${stage?.colour ?? "FFFFFF"}`
    
    container.appendChild(colourPickerLabel);
    container.appendChild(colourPickerInput);

    return container
}

function renderTaskForm(task = null) {
    const container = document.createElement("div");

    // i'll figure out how to add a stage select later - maybe i have to have a "select board" and then "select stage"?? 

    const titleLabel = document.createElement("label");
    titleLabel.htmlFor = "title";
    titleLabel.textContent = "Title: ";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.name = "title";
    titleInput.id = "title";
    titleInput.required = true;
    titleInput.value = task?.title ?? "";

    container.appendChild(titleLabel);
    container.appendChild(titleInput);

    const taskDescriptionLabel = document.createElement("label");
    taskDescriptionLabel.htmlFor = "description";
    taskDescriptionLabel.textContent = "Description:";
    const taskDescriptionInput = document.createElement("textarea");
    taskDescriptionInput.name = "description";
    taskDescriptionInput.id = "description";
    taskDescriptionInput.maxLength = 1000;
    taskDescriptionInput.textContent = task?.description ?? "";

    container.appendChild(taskDescriptionLabel);
    container.appendChild(taskDescriptionInput);

    const deadlineLabel = document.createElement("label");
    deadlineLabel.htmlFor = "deadline";
    deadlineLabel.textContent = "Deadline:";
    const deadlineInput = document.createElement("input");
    deadlineInput.name = "deadline";
    deadlineInput.id = "deadline";
    deadlineInput.type = "date";
    deadlineInput.value = task?.deadline ?? "";

    container.appendChild(deadlineLabel);
    container.appendChild(deadlineInput);

    const completionLabel = document.createElement("label");
    completionLabel.htmlFor = "complete";
    completionLabel.textContent = "Complete?";
    const completionInput = document.createElement("input");
    completionInput.name = "complete";
    completionInput.id = "complete";
    completionInput.type = "checkbox";
    completionInput.checked = task?.is_complete ?? false;

    container.appendChild(completionLabel);
    container.appendChild(completionInput);

    // add parent task option in m6
    // add tags in m5
    // add recurrence functionality in m10

    return container;
}

export { 
    renderBoardTabs,
    renderStage,
    renderHeader,
    renderTask,
    renderFormTemplate,
    renderBoardForm,
    renderStageForm,
    renderTaskForm
}