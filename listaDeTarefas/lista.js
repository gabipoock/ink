const navList = document.getElementById('nav-list');
const menuToggle = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  navList.classList.toggle('show');
});



//tarefas
    const taskList = document.getElementById('taskList');
    const addTaskBtn = document.getElementById('addTaskBtn');

    // Altera a cor de fundo para vermelho quando o checkbox for marcado


  // Tarefas iniciais - 10 exemplos
  const initialTasks = [
    "Ir ao banheiro",
    "Tomar banho",
    "Escovar os dentes",
    "Tomar café da manhã",
    "...",
    "Almoçar",
    "Escola/Terapia",
    "Dever de casa",
    "Estudar programação",
    "Relaxar"
  ];

  // Função para criar uma tarefa
  // color: 'purple' ou 'blue'
  function createTask(text = '', color = 'purple', checked = false) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task', color);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;

    const inputText = document.createElement('input');
    inputText.type = 'text';
    inputText.placeholder = 'Digite a tarefa...';
    inputText.value = text;

    taskDiv.appendChild(inputText);
    taskDiv.appendChild(checkbox);
    


    return taskDiv;
  }

  // Inicializa as tarefas na tela
  function loadInitialTasks() {
    for (let i = 0; i < initialTasks.length; i++) {
      const color = i % 2 === 0 ? 'purple' : 'blue';
      const task = createTask(initialTasks[i], color);
      taskList.appendChild(task);
    }
  }

  // Adiciona uma nova tarefa, alternando a cor com base na última tarefa
  function addNewTask() {
    const tasks = taskList.querySelectorAll('.task');
    let color = 'purple'; // padrão
    if (tasks.length > 0) {
      const lastColor = tasks[tasks.length - 1].classList.contains('purple') ? 'purple' : 'blue';
      color = lastColor === 'purple' ? 'blue' : 'purple';
    }
    const newTask = createTask('', color);
    taskList.appendChild(newTask);
    newTask.querySelector('input[type="text"]').focus();
  }

  addTaskBtn.addEventListener('click', addNewTask);

  // Carregar tarefas iniciais ao abrir
  loadInitialTasks();
