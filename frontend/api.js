const API_BASE = "http://127.0.0.1:8000";

async function apiFetch(url, method, body) {
    const isPostOrPut = ['POST', 'PUT', 'PATCH'].includes(method);
    const response = await fetch(`${API_BASE}${url}`, {
        method: method,
        headers: {
            ...(isPostOrPut && { 'Content-Type': 'application/json' })
            
        },
        credentials: "include",
        ...(isPostOrPut && { body: JSON.stringify(body)})
    })

    if (response.ok) {
        if (response.status === 204) {
            return null
        } else {
            return await response.json()
        }
    } else {
        const errCode = response.status;
        let errMsg = ""
        try {
            const errBody = await response.json();
            errMsg = errCode + ": " + errBody.detail;
        } catch {
            errMsg = errCode;
        }
        throw new Error(`Response failed with error code ${errMsg}`)

    }
}

// --- BOARD FUNCTIONS ---
// create
async function createBoard(body) {
    const data = await apiFetch("/boards", "POST", body);
    return data;
}

// read
async function getBoards() {
    const data = await apiFetch("/boards", "GET");
    return data;
}

async function getIndividualBoard(boardId) {
    const data = await apiFetch(`/boards/${boardId}`, "GET");
    return data;
}

// update
async function updateBoard(boardId, body) {
    const data = await apiFetch(`/boards/${boardId}`, "PATCH", body);
    return data;
}

// delete
async function deleteBoard(boardId) {
    const data = await apiFetch(`/boards/${boardId}`, "DELETE");
    return data;
}

// --- STAGE FUNCTIONS ---
// create
async function createStage(boardId, body) {
    const data = await apiFetch(`/boards/${boardId}/stages`, "POST", body);
    return data;
}

// read
async function getStages(boardId) {
    const data = await apiFetch(`/boards/${boardId}/stages`, "GET");
    return data;
}

async function getIndividualStage(boardId, stageId) {
    const data = await apiFetch(`/boards/${boardId}/stages${stageId}`, "GET");
    return data;
}

// update
async function updateStage(boardId, stageId, body) {
    const data = await apiFetch(`/boards/${boardId}/stages/${stageId}`, "PATCH", body);
    return data;
}

// delete
async function deleteStage(boardId, stageId) {
    const data = await apiFetch(`/boards/${boardId}/stages/${stageId}`, "DELETE");
    return data;
}

// special functions
async function reorderStages(boardId, stageIds) {
    const data = await apiFetch(`/boards/${boardId}/stages`, "PUT", { stage_ids: stageIds });
    return data;
}

// --- TASK FUNCTIONS ---
// create
async function createTask(boardId, stageId, body) {
    const data = await apiFetch(`/boards/${boardId}/stages/${stageId}/tasks`, "POST", body);
    return data;
}

// read
async function getTasks(boardId, stageId) {
    const data = await apiFetch(`/boards/${boardId}/stages/${stageId}/tasks`, "GET");
    return data;
}

async function getIndividualTask(boardId, stageId, taskId) {
    const data = await apiFetch(`/boards/${boardId}/stages/${stageId}/tasks/${taskId}`, "GET");
    return data;
}

// update
async function updateTask(boardId, stageId, taskId, body) {
    const data = await apiFetch(`/boards/${boardId}/stages/${stageId}/tasks/${taskId}`, "PATCH", body);
    return data
}

// delete
async function deleteTask(boardId, stageId, taskId) {
    const data = await apiFetch(`/boards/${boardId}/stages/${stageId}/tasks/${taskId}`, "DELETE");
    return data;
}

// special functions
async function reorderTasks(boardId, stageId, taskIds) {
    const data = await apiFetch(`/boards/${boardId}/stages/${stageId}/tasks`, "PUT", { task_ids: taskIds });
    return data;
}

async function moveTasks(boardId, stageId, taskId, body) {
    const data = await apiFetch(`/boards/${boardId}/stages/${stageId}/tasks/${taskId}/stage`, "PATCH", body);
    return data;
}

export { 
    createBoard, 
    getBoards, 
    getIndividualBoard, 
    updateBoard, 
    deleteBoard, 
    createStage, 
    getStages, 
    getIndividualStage, 
    updateStage, 
    deleteStage, 
    reorderStages,
    createTask,
    getTasks,
    getIndividualTask,
    updateTask,
    deleteTask,
    reorderTasks
}