window.onload = () => {
  const welcomeText = "Welcome To My Portfolio";
  const loadingText = "Loading Portfolio...";
  const bootScreen = document.getElementById('boot-screen');
  const welcomeEl = document.querySelector('#boot-screen h1');
  const loadingEl = document.querySelector('#boot-screen p');
  
  welcomeEl.textContent = '';
  loadingEl.textContent = '';
  
  let i = 0;
  const typeWelcome = setInterval(() => {
    if (i < welcomeText.length) {
      welcomeEl.textContent += welcomeText.charAt(i);
      i++;
    } else {
      clearInterval(typeWelcome);
      typeLoading();
    }
  }, 100);
  
  function typeLoading() {
    let j = 0;
    const typeLoad = setInterval(() => {
      if (j < loadingText.length) {
        loadingEl.textContent += loadingText.charAt(j);
        j++;
      } else {
        clearInterval(typeLoad);
        setTimeout(() => {
          bootScreen.style.animation = 'fadeOut 1s ease forwards';
          setTimeout(() => {
            bootScreen.style.display = 'none';
            document.getElementById('desktop').style.display = 'flex';
            initDesktop();
          }, 1000);
        }, 2000);
      }
    }, 50);
  }
};

const projects = [
  {
    id: 'proj1',
    name: 'Chatroom With An Encrypter',
    summary: 'A secure chatroom that uses sockets with built-in encryption.',
    img: 'images/Encrypt.png',
    details: 'This project was developed in Python and leverages socket programming for real-time communication. The encryption module ensures all messages are secure and private.',
    category: 'python'
  },
  {
    id: 'proj2',
    name: 'CyberSecurity Automated Recon Tool',
    summary: 'An automated reconnaissance tool that streamlines security assessments.',
    img: 'images/Recon Tool.png',
    details: 'Built with Bash scripting, this tool automates various reconnaissance techniques used in cybersecurity assessments, saving valuable time during security evaluations.',
    category: 'bash'
  },
  {
    id: 'proj3',
    name: 'Perlin Noise Simulator',
    summary: 'A visual simulator showcasing Perlin noise with detailed seed information.',
    img: 'images/Perlin.png',
    details: 'Developed using HTML, CSS, and JavaScript, this web application visualizes Perlin noise algorithms and provides detailed analysis of the generated patterns.',
    category: 'web'
  }
];

function initDesktop() {
  populateProjects('all');
  
  updateDateTime();
  setInterval(updateDateTime, 60000);
  
  setupProjectFilters();
  
  setTimeout(showNotification, 1500);
  
  setupResizeHandles();
  
  positionWindows();
}

function updateDateTime() {
  const now = new Date();
  const options = { weekday: 'short', hour: '2-digit', minute: '2-digit' };
  document.getElementById('datetime').textContent = now.toLocaleString('en-SG', options);
}

function setupProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      populateProjects(btn.getAttribute('data-filter'));
    });
  });
}

function populateProjects(filter = 'all') {
  const container = document.getElementById('project-list');
  container.innerHTML = '';
  
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);
    
  filteredProjects.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card animate-in';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="project-info">
        <h4>${p.name}</h4>
        <p>${p.summary}</p>
        <span class="project-tag">${p.category}</span>
      </div>
    `;
    card.onclick = () => openProjectWindow(p);
    container.appendChild(card);
  });
}

function launchApp(id) {
  const app = document.getElementById(id);
  
  if (app.style.display === 'block') {
    focusWindow(app);
    return;
  }
  
  app.style.display = 'block';
  app.style.zIndex = getTopZIndex() + 1;
  
  if (!app.style.left) {
    app.style.left = `${window.innerWidth / 2 - 350}px`;
    app.style.top = `${window.innerHeight / 2 - 250}px`;
  }
  
  if (!document.getElementById(`task-${id}`)) {
    let icon;
    switch(id) {
      case 'about': icon = 'user'; break;
      case 'projects': icon = 'laptop-code'; break;
      case 'contact': icon = 'envelope'; break;
      case 'terminal': icon = 'terminal'; break;
      default: icon = 'window-maximize';
    }
    
    const btn = document.createElement('button');
    btn.id = `task-${id}`;
    btn.className = 'task-btn active';
    btn.innerHTML = `<i class="fas fa-${icon}"></i> ${id.charAt(0).toUpperCase() + id.slice(1)}`;
    btn.onclick = () => toggleApp(id);
    document.getElementById('task-items').appendChild(btn);
  } else {
    document.getElementById(`task-${id}`).classList.add('active');
  }
  
  focusWindow(app);
}

function toggleApp(id) {
  const app = document.getElementById(id);
  const taskBtn = document.getElementById(`task-${id}`);
  
  if (app.style.display === 'none') {
    app.style.display = 'block';
    taskBtn.classList.add('active');
    focusWindow(app);
  } else if (app === getActiveWindow()) {
    minimizeApp(id);
  } else {
    focusWindow(app);
  }
}

function minimizeApp(id) {
  const win = document.getElementById(id);
  win.style.display = 'none';
  document.getElementById(`task-${id}`).classList.remove('active');
}

function closeApp(id) {
  const win = document.getElementById(id);
  win.style.display = 'none';
  
  const taskBtn = document.getElementById(`task-${id}`);
  if (taskBtn) {
    taskBtn.remove();
  }
  
  if (id.startsWith('win-proj')) {
    win.remove();
  }
}

function maximizeApp(id) {
  const win = document.getElementById(id);
  
  if (win.classList.contains('maximized')) {
    win.classList.remove('maximized');
  } else {
    win.classList.add('maximized');
  }
}

function getActiveWindow() {
  let activeWindow = null;
  let topZ = 0;
  
  document.querySelectorAll('.app-window').forEach(win => {
    if (win.style.display === 'block') {
      const z = parseInt(win.style.zIndex || 0);
      if (z > topZ) {
        topZ = z;
        activeWindow = win;
      }
    }
  });
  
  return activeWindow;
}

function focusWindow(win) {
  document.querySelectorAll('.task-btn').forEach(btn => btn.classList.remove('active'));
  
  const id = win.id;
  const taskBtn = document.getElementById(`task-${id}`);
  if (taskBtn) {
    taskBtn.classList.add('active');
  }
  
  win.style.zIndex = getTopZIndex() + 1;
}

function getTopZIndex() {
  let topZ = 999;
  document.querySelectorAll('.app-window').forEach(win => {
    const z = parseInt(win.style.zIndex || 0);
    if (z > topZ) topZ = z;
  });
  return topZ;
}

let dragOffsetX, dragOffsetY, activeWindow;

function startDrag(e, el) {
  activeWindow = el.closest('.app-window');
  
  focusWindow(activeWindow);
  
  const rect = activeWindow.getBoundingClientRect();
  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;

  document.addEventListener('mousemove', dragWindow);
  document.addEventListener('mouseup', stopDrag);
  
  e.preventDefault();
}

function dragWindow(e) {
  if (!activeWindow) return;
  
  let left = e.clientX - dragOffsetX;
  let top = e.clientY - dragOffsetY;
  
  if (left < 0) left = 0;
  if (top < 0) top = 0;
  if (left > window.innerWidth - 100) left = window.innerWidth - 100;
  if (top > window.innerHeight - 50) top = window.innerHeight - 50;
  
  activeWindow.style.left = `${left}px`;
  activeWindow.style.top = `${top}px`;
  
  activeWindow.classList.remove('maximized');
}

function stopDrag() {
  document.removeEventListener('mousemove', dragWindow);
  document.removeEventListener('mouseup', stopDrag);
  activeWindow = null;
}

function setupResizeHandles() {
  document.querySelectorAll('.app-window').forEach(win => {
    win.style.minWidth = '300px';
    win.style.minHeight = '200px';
  });
}

function positionWindows() {
  const windows = document.querySelectorAll('.app-window');
  let left = 50;
  let top = 50;
  
  windows.forEach(win => {
    win.style.left = `${left}px`;
    win.style.top = `${top}px`;
    left += 30;
    top += 30;
    
    if (left > 300) left = 50;
    if (top > 200) top = 50;
  });
}

function openProjectWindow(project) {
  const id = `win-${project.id}`;
  
  if (document.getElementById(id)) {
    launchApp(id);
    return;
  }

  const win = document.createElement('div');
  win.id = id;
  win.className = 'app-window';
  win.style.zIndex = getTopZIndex() + 1;
  
  win.style.left = `${window.innerWidth / 2 - 350}px`;
  win.style.top = `${window.innerHeight / 2 - 250}px`;
  
  win.innerHTML = `
    <div class="title-bar" onmousedown="startDrag(event, this)">
      <div class="window-icon"><i class="fas fa-${project.category === 'web' ? 'code' : project.category === 'python' ? 'python' : 'terminal'}"></i></div>
      <span>${project.name}</span>
      <div class="window-controls">
        <button onclick="minimizeApp('${id}')"><i class="fas fa-window-minimize"></i></button>
        <button onclick="maximizeApp('${id}')"><i class="fas fa-window-maximize"></i></button>
        <button onclick="closeApp('${id}')"><i class="fas fa-times"></i></button>
      </div>
    </div>
    <div class="content">
      <div class="project-detail-container">
        <div class="project-detail-header">
          <img src="${project.img}" alt="${project.name}">
          <h2>${project.name}</h2>
          <span class="project-tag">${project.category}</span>
        </div>
        <div class="project-detail-content">
          <p>${project.details}</p>
          <div class="project-actions" style="margin-top: 20px;">
            <button class="send-btn"><i class="fas fa-code"></i> View Source</button>
            <button class="send-btn" style="margin-left: 10px;"><i class="fas fa-external-link-alt"></i> Live Demo</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('desktop').appendChild(win);
  setupResizeHandles();
  launchApp(id);
}

function toggleStartMenu() {
  const menu = document.getElementById('start-menu');
  if (menu.style.display === 'none') {
    menu.style.display = 'block';
    
    setTimeout(() => {
      document.addEventListener('click', closeStartMenu);
    }, 10);
  } else {
    menu.style.display = 'none';
  }
}

function closeStartMenu(e) {
  const menu = document.getElementById('start-menu');
  const startButton = document.getElementById('start-menu-button');
  
  if (!menu.contains(e.target) && e.target !== startButton) {
    menu.style.display = 'none';
    document.removeEventListener('click', closeStartMenu);
  }
}

function handleTerminal(e) {
  if (e.key !== 'Enter') return;
  
  const input = e.target.value.trim();
  const output = document.getElementById('terminal-output');
  
  output.innerHTML += `\nguest@portfolio:~$ ${input}`;
  
  if (input.toLowerCase() === 'help') {
    output.innerHTML += `\n\nAvailable commands:
  about - Open about me window
  projects - Open projects window
  contact - Open contact form
  clear - Clear terminal
  date - Show current date and time
  list - List all projects
  echo [text] - Print text to terminal
  github - Open GitHub profile
  exit - Close terminal window`;
  } 
  else if (input.toLowerCase() === 'about') {
    output.innerHTML += '\nOpening about window...';
    launchApp('about');
  } 
  else if (input.toLowerCase() === 'projects') {
    output.innerHTML += '\nOpening projects window...';
    launchApp('projects');
  } 
  else if (input.toLowerCase() === 'contact') {
    output.innerHTML += '\nOpening contact form...';
    launchApp('contact');
  } 
  else if (input.toLowerCase() === 'clear') {
    output.innerHTML = '';
  }
  else if (input.toLowerCase() === 'date') {
    const now = new Date();
    output.innerHTML += `\nCurrent date: ${now.toLocaleString()}`;
  }
  else if (input.toLowerCase() === 'list') {
    output.innerHTML += '\n\nProjects:';
    projects.forEach(p => {
      output.innerHTML += `\n- ${p.name} (${p.category})`;
    });
  }
  else if (input.toLowerCase().startsWith('echo ')) {
    const text = input.substring(5);
    output.innerHTML += `\n${text}`;
  }
  else if (input.toLowerCase() === 'github') {
    output.innerHTML += '\nOpening GitHub profile...';
    window.open('https://github.com/HappyCPPD', '_blank');
  }
  else if (input.toLowerCase() === 'exit') {
    output.innerHTML += '\nClosing terminal...';
    setTimeout(() => closeApp('terminal'), 500);
  }
  else {
    output.innerHTML += `\nCommand not found: ${input}`;
  }

  e.target.value = '';
  output.scrollTop = output.scrollHeight;
}

function showNotification() {
  const notification = document.getElementById('notification');
  notification.style.display = 'flex';
  
  setTimeout(() => {
    closeNotification();
  }, 5000);
}

function closeNotification() {
  const notification = document.getElementById('notification');
  notification.style.display = 'none';
}

function sendMessage() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  
  if (!name || !email || !message) {
    alert('Please complete all fields before sending your message.');
    return;
  }
  
  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  document.getElementById('message').value = '';
  
  document.querySelector('.notification-text').textContent = 'Message sent successfully!';
  document.querySelector('.notification-icon').className = 'notification-icon fas fa-check-circle';
  showNotification();
}