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
    stage.style.setProperty("--stage-colour", `#${stageData.colour ?? "FFF"}`)
    stage.id = `stage-${stageData.id}`;
    stage.dataset.stageId = stageData.id;
    
    const stageDetails = document.createElement("div");
    stageDetails.classList.add("stageDetails");
    const stageName = document.createElement("h2");
    stageName.textContent = stageData.stage_name;
    const taskCount = document.createElement("p");
    taskCount.textContent = "Task count goes here";
    stageDetails.appendChild(stageName);
    stageDetails.appendChild(taskCount);
    stage.append(stageDetails);

    const stageContent = document.createElement("div");
    stageContent.classList.add("stageContent");
    tasks.forEach((task) => stageContent.append(renderTask(task)))
    stage.append(stageContent)

    const buttons = document.createElement("div");
    const editStage = document.createElement("button");
    editStage.textContent = "Edit stage";
    editStage.classList.add("editStageBtn");
    editStage.dataset.stageId = stageData.id;
    buttons.appendChild(editStage);
    const deleteStage = document.createElement("button");
    deleteStage.textContent = "Delete stage";
    deleteStage.classList.add("deleteStageBtn");
    deleteStage.dataset.stageId = stageData.id;
    buttons.appendChild(deleteStage);
    const addTask = document.createElement("button");
    addTask.textContent = "Add task";
    addTask.classList.add("addTaskBtn");
    addTask.dataset.stageId = stageData.id;
    buttons.append(addTask);
    stage.append(buttons)

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

    const deleteBoard = document.createElement("button");
    deleteBoard.textContent = "Delete board";
    deleteBoard.id = "deleteBoard";
    header.appendChild(deleteBoard);

    const addStage = document.createElement("button");
    addStage.textContent = "Add stage";
    addStage.id = "addStage";
    header.appendChild(addStage);

    

    return header;
}

function renderTask(task) {
    const taskContainer = document.createElement("div");
    taskContainer.id = `task-${task.id}`;
    taskContainer.classList.add("task");
    if (task.is_complete) taskContainer.classList.add("finished");
    task.parent_task_id ? taskContainer.classList.add("subtask") : taskContainer.classList.add("task")
    
    const taskName = document.createElement("h2");
    taskName.textContent = task.title;
    taskContainer.appendChild(taskName);

    // this is for m4
    const tagContainer = document.createElement("div");
    task.tags.forEach((tag) => tagContainer.append(renderTag(tag)));
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

    const buttons = document.createElement("div");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit task";
    editBtn.classList.add("editTask");
    editBtn.dataset.taskId = task.id;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete task";
    deleteBtn.classList.add("deleteTask");
    deleteBtn.dataset.taskId = task.id;

    buttons.appendChild(editBtn);
    buttons.appendChild(deleteBtn);
    taskContainer.appendChild(buttons);

    const finishedLabel = document.createElement("label");
    finishedLabel.htmlFor = `finished-task-${task.id}`;
    finishedLabel.textContent = "Finished?";
    const finishedCheck = document.createElement("input");
    finishedCheck.type = "checkbox";
    finishedCheck.id = `finished-task-${task.id}`;
    finishedCheck.name = `finished-task-${task.id}`;
    finishedCheck.checked = task.is_complete ?? false;
    finishedCheck.classList.add("finishTask");
    finishedCheck.dataset.taskId = task.id;
    
    taskContainer.appendChild(finishedLabel);
    taskContainer.appendChild(finishedCheck);

    return taskContainer
}

function renderTag(tag) {
    const tagElement = document.createElement("span");
    tagElement.style.setProperty("--tag-colour", `#${tag.colour ?? "AAA"}`);
    const tagLink = document.createElement("a");
    tagLink.href = "#";
    tagLink.textContent = tag.tag_name;
    tagElement.appendChild(tagLink);
    tagLink.style.color = "inherit"
    return tagElement;
}

function renderDeleteAlert(type, title) {
    const dialog = document.createElement("dialog");
    
    const text = document.createElement("p");
    text.textContent = `Are you sure you want to delete ${type} "${title}"? ${(type === "board") ? "Any and all stages and tasks will be deleted." : (type === "stage") ? "Any and all tasks will be deleted" : ""}`
    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.id = "closeBtn";
    cancelBtn.textContent = "Cancel"

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.id = "confirmBtn";
    confirmBtn.textContent = "Confirm"

    dialog.appendChild(text);
    dialog.appendChild(cancelBtn);
    dialog.appendChild(confirmBtn);

    return dialog;
}

function renderFormTemplate(renderFormContent) {
    const dialog = document.createElement("dialog");
    const form = document.createElement("form");
    form.method = "dialog";
    
    const content = renderFormContent();
    form.appendChild(content)

    const formActions = document.createElement("div");
    formActions.classList.add("formActions")
    
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
    const container = document.createElement("div");

    const header = document.createElement("h1");
    const boardTitle = board?.board_name ?? "";
    
    if (boardTitle) {
        header.textContent = `Edit Board "${boardTitle}"`
    } else {
        header.textContent = "Create Board";
    }

    container.appendChild(header);

    const titleInputRow = document.createElement("div");
    titleInputRow.classList.add("inputRow");
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
    titleInput.value = boardTitle;
    
    titleInputRow.appendChild(titleLabel);
    titleInputRow.appendChild(titleInput);
    container.appendChild(titleInputRow);

    const colourInputRow = document.createElement("div");
    colourInputRow.classList.add("inputRow");
    const colourPickerLabel = document.createElement("label");
    colourPickerLabel.htmlFor = "colour";
    colourPickerLabel.textContent = "Board colour: ";
    const colourPickerInput = document.createElement("input");
    colourPickerInput.name = "colour";
    colourPickerInput.id = "colour"
    colourPickerInput.type = "color";
    colourPickerInput.value = `#${board?.colour ?? "FFFFFF"}`

    colourInputRow.appendChild(colourPickerLabel);
    colourInputRow.appendChild(colourPickerInput);
    container.append(colourInputRow);

    return container
}

function renderStageForm(stage = null) {
    const container = document.createElement("div");

    const header = document.createElement("h1");
    const stageTitle = stage?.stage_name ?? "";
    
    if (stageTitle) {
        header.textContent = `Edit Stage "${stageTitle}"`
    } else {
        header.textContent = "Create Stage";
    }

    container.appendChild(header);


    const nameInputRow = document.createElement("div");
    nameInputRow.classList.add("inputRow");
    const nameLabel = document.createElement("label");
    nameLabel.htmlFor = "stage_name";
    nameLabel.textContent = "Name: ";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "stage_name"
    nameInput.id = "stage_name";
    nameInput.required = true;
    nameInput.value = stageTitle;

    nameInputRow.appendChild(nameLabel);
    nameInputRow.appendChild(nameInput);
    container.appendChild(nameInputRow);

    const colourInputRow = document.createElement("div");
    colourInputRow.classList.add("inputRow");
    const colourPickerLabel = document.createElement("label");
    colourPickerLabel.htmlFor = "colour";
    colourPickerLabel.textContent = "Section colour: ";
    const colourPickerInput = document.createElement("input");
    colourPickerInput.name = "colour";
    colourPickerInput.id = "colour"
    colourPickerInput.type = "color";
    colourPickerInput.value = `#${stage?.colour ?? "FFFFFF"}`
    
    colourInputRow.appendChild(colourPickerLabel);
    colourInputRow.appendChild(colourPickerInput);
    container.appendChild(colourInputRow);

    return container
}

function renderTaskForm(task = null, allTags) {
    const container = document.createElement("div");

    // i'll figure out how to add a stage select later - maybe i have to have a "select board" and then "select stage"?? 


    const header = document.createElement("h1");
    const taskTitle = task?.title ?? "";
    
    if (taskTitle) {
        header.textContent = `Edit Task "${taskTitle}"`
    } else {
        header.textContent = "Create Task";
    }

    container.appendChild(header);

    const titleInputRow = document.createElement("div");
    titleInputRow.classList.add("inputRow");
    const titleLabel = document.createElement("label");
    titleLabel.htmlFor = "title";
    titleLabel.textContent = "Title: ";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.name = "title";
    titleInput.id = "title";
    titleInput.required = true;
    titleInput.value = task?.title ?? "";

    titleInputRow.appendChild(titleLabel);
    titleInputRow.appendChild(titleInput);
    container.appendChild(titleInputRow)


    const tagPickerFieldset = document.createElement("fieldset");
    tagPickerFieldset.classList.add("tagPicker");

    allTags.forEach((tag) => {
        const tagOptionDiv = document.createElement("div");
        tagOptionDiv.classList.add("tagOption");

        const tagInput = document.createElement("input");
        tagInput.id = `tag-${tag.id}`;
        tagInput.name = "tag_ids";
        tagInput.value = `${tag.id}`;
        tagInput.type = "checkbox"
        
        if (task?.tags?.some((t) => t.id === tag.id)) {
            tagInput.checked = true
        }

        tagOptionDiv.appendChild(tagInput);

        const tagLabel = document.createElement("label");
        tagLabel.htmlFor = `tag-${tag.id}`;
        tagLabel.textContent = tag.tag_name;
        tagOptionDiv.appendChild(tagLabel);
        tagOptionDiv.style.setProperty("--tag-colour", `#${tag.colour}` ?? "#FFF");

        tagPickerFieldset.appendChild(tagOptionDiv)
    })

    container.appendChild(tagPickerFieldset)

    const descriptionInputRow = document.createElement("div");
    descriptionInputRow.classList.add("inputRow");
    const taskDescriptionLabel = document.createElement("label");
    taskDescriptionLabel.htmlFor = "task_description";
    taskDescriptionLabel.textContent = "Description:";
    const taskDescriptionInput = document.createElement("textarea");
    taskDescriptionInput.name = "task_description";
    taskDescriptionInput.id = "task_description";
    taskDescriptionInput.maxLength = 1000;
    taskDescriptionInput.textContent = task?.task_description ?? "";

    descriptionInputRow.appendChild(taskDescriptionLabel);
    descriptionInputRow.appendChild(taskDescriptionInput);
    container.appendChild(descriptionInputRow)

    const deadlineInputRow = document.createElement("div");
    deadlineInputRow.classList.add("inputRow");
    const deadlineLabel = document.createElement("label");
    deadlineLabel.htmlFor = "deadline";
    deadlineLabel.textContent = "Deadline:";
    const deadlineInput = document.createElement("input");
    deadlineInput.name = "deadline";
    deadlineInput.id = "deadline";
    deadlineInput.type = "date";
    deadlineInput.value = task?.deadline ?? "";

    deadlineInputRow.appendChild(deadlineLabel);
    deadlineInputRow.appendChild(deadlineInput);
    container.appendChild(deadlineInputRow);

    if (task) {
        const completionInputRow = document.createElement("div");
        completionInputRow.classList.add("inputRow");
        const completionLabel = document.createElement("label");
        completionLabel.htmlFor = "-s_complete";
        completionLabel.textContent = "Complete?";
        const completionInput = document.createElement("input");
        completionInput.name = "is_complete";
        completionInput.id = "is_complete";
        completionInput.type = "checkbox";
        completionInput.checked = task?.is_complete ?? false;

        completionInputRow.appendChild(completionLabel);
        completionInputRow.appendChild(completionInput);
        container.appendChild(completionInputRow);
    }

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
    renderTaskForm,
    renderDeleteAlert
}