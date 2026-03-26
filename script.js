let courses = JSON.parse(localStorage.getItem("courses")) || [];
let assignments = JSON.parse(localStorage.getItem("assignments")) || [];
let currentFilter = "all";

function save() {
    localStorage.setItem("courses", JSON.stringify(courses));
    localStorage.setItem("assignments", JSON.stringify(assignments));
}

function addCourse() {
    const name = document.getElementById("courseName").value;
    if (!name) return;

    courses.push({ id: Date.now(), name });
    save();
    renderCourses();
}

function addAssignment() {
    const title = document.getElementById("title").value;
    const courseId = document.getElementById("courseSelect").value;
    const deadline = document.getElementById("deadline").value;
    const priority = document.getElementById("priority").value;

    if (!title || !deadline) return;

    assignments.push({
        id: Date.now(),
        title,
        courseId,
        deadline,
        priority
    });

    save();
    renderAssignments();
}

function renderCourses() {
    const select = document.getElementById("courseSelect");
    select.innerHTML = "";

    courses.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.name;
        select.appendChild(option);
    });
}

function getDaysLeft(date) {
    const today = new Date();
    const due = new Date(date);
    const diff = due - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function filterAssignments(list) {
    const today = new Date();

    if (currentFilter === "today") {
        return list.filter(a => getDaysLeft(a.deadline) === 0);
    }

    if (currentFilter === "week") {
        return list.filter(a => {
            const d = getDaysLeft(a.deadline);
            return d >= 0 && d <= 7;
        });
    }

    return list;
}

function renderAssignments() {
    const list = document.getElementById("assignmentList");
    list.innerHTML = "";

    let filtered = filterAssignments(assignments);

    filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    filtered.forEach(a => {
        const li = document.createElement("li");
        li.className = a.priority;

        const course = courses.find(c => c.id == a.courseId);
        const days = getDaysLeft(a.deadline);

        let text = `${a.title} (${course ? course.name : "No course"})`;

        if (days === 0) text += " - Due Today";
        else if (days > 0) text += ` - ${days} days left`;
        else text += " - Overdue";

        const span = document.createElement("span");
        span.textContent = text;


        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑";
        delBtn.onclick = () => deleteAssignment(a.id);


        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";
        editBtn.onclick = () => editAssignment(a.id);


        const actions = document.createElement("div");
        actions.appendChild(editBtn);
        actions.appendChild(delBtn);

        actions.style.float = "right";

        li.appendChild(span);
        li.appendChild(actions);
        //li.textContent = text;
        list.appendChild(li);
    });
}

function setFilter(filter) {
    currentFilter = filter;
    renderAssignments();
}

document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("dark");
};

renderCourses();
renderAssignments();

// Delete assignment function
function deleteAssignment(id) {
    assignments = assignments.filter(a => a.id !== id);
    save();
    renderAssignments();
}

// Edit assignment function
function editAssignment(id) {
    const assignment = assignments.find(a => a.id === id);

    const newTitle = prompt("Edit title:", assignment.title);
    const newDeadline = prompt("Edit deadline (YYYY-MM-DD):", assignment.deadline);
    const newPriority = prompt("Edit priority (low, medium, high):", assignment.priority);

    if (newTitle) assignment.title = newTitle;
    if (newDeadline) assignment.deadline = newDeadline;
    if (newPriority) assignment.priority = newPriority;

    save();
    renderAssignments();
}