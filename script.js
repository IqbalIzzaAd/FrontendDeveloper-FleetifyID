document.addEventListener("DOMContentLoaded", () => {
    const taskTitle = document.getElementById("task-title");
    const taskDesc = document.getElementById("task-desc");
    const addTaskBtn = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");
    const filterTasks = document.getElementById("filter-tasks");
    const toggleDarkMode = document.getElementById("toggle-dark-mode");

    // Cek dan aktifkan Dark Mode jika sebelumnya tersimpan di LocalStorage
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }

    // Load tugas dari LocalStorage saat halaman dimuat
    loadTasks();

    // Tambah Tugas
    addTaskBtn.addEventListener("click", () => {
        if (taskTitle.value.trim() === "") return;
        addTask(taskTitle.value, taskDesc.value, false);
        saveTasks();
        taskTitle.value = "";
        taskDesc.value = "";
    });

    // Klik untuk ubah status/edit/hapus tugas
    taskList.addEventListener("click", (e) => {
        const row = e.target.closest("tr");

        if (e.target.classList.contains("status")) {
            toggleStatus(e.target, row);
        } else if (e.target.classList.contains("edit")) {
            taskTitle.value = row.children[0].innerText;
            taskDesc.value = row.children[1].innerText;
            row.remove();
        } else if (e.target.classList.contains("delete")) {
            row.remove();
        }

        saveTasks();
        filterTaskList(); // Pastikan filter tetap aktif setelah perubahan
    });

    // Filter tugas berdasarkan status
    filterTasks.addEventListener("change", filterTaskList);

    // Toggle Dark Mode
    toggleDarkMode.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
    });

    function addTask(title, desc, completed) {
        const row = document.createElement("tr");
        if (completed) row.classList.add("completed");

        row.innerHTML = `
            <td>${title}</td>
            <td>${desc}</td>
            <td>
                <button class="status">${completed ? 'Selesai' : 'Pending'}</button>
                <button class="edit">Edit</button>
                <button class="delete">Hapus</button>
            </td>
        `;

        taskList.appendChild(row);
        filterTaskList(); // Pastikan filter tetap aktif setelah menambahkan tugas
    }

    function toggleStatus(button, row) {
        row.classList.toggle("completed");
        button.innerText = row.classList.contains("completed") ? "Selesai" : "Pending";
        saveTasks();
        filterTaskList(); // Perbarui tampilan berdasarkan filter aktif
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify([...taskList.children].map(task => ({
            title: task.children[0].innerText,
            desc: task.children[1].innerText,
            completed: task.classList.contains("completed")
        }))));
    }

    function loadTasks() {
        JSON.parse(localStorage.getItem("tasks") || "[]").forEach(addTask);
    }

    function filterTaskList() {
        taskList.querySelectorAll("tr").forEach(task => {
            const isCompleted = task.classList.contains("completed");

            if (filterTasks.value === "all") {
                task.style.display = "table-row";
            } else if (filterTasks.value === "completed") {
                task.style.display = isCompleted ? "table-row" : "none";
            } else if (filterTasks.value === "pending") {
                task.style.display = !isCompleted ? "table-row" : "none";
            }
        });
    }
});
