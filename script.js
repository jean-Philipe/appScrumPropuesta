// Role and Logs Management
let currentRole = 'student';
const logs = [];

// Sprint Management
let currentSprint = 1;
const sprints = {
    1: {
        stories: [
            // Existing stories will be moved here
        ],
        burndownData: {
            // Simulated data for Sprint 1
            labels: ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5', 'Día 6', 'Día 7', 'Día 8', 'Día 9', 'Día 10'],
            actual: [180, 160, 140, 100, 150, 120, 90, 50, 20, 0],
            ideal: [180, 160, 140, 120, 100, 80, 60, 40, 20, 0]
        },
        userActivity: {
            'Juan': 8,
            'María': 12,
            'Pedro': 5,
            'Ana': 7
        }
    },
    2: {
        stories: [
            {
                id: "US-201",
                title: "Implementar sistema de comentarios",
                description: "Como usuario, quiero poder comentar en las publicaciones.",
                status: "Por Hacer",
                points: "5",
                priority: "Media"
            },
            {
                id: "US-202",
                title: "Sistema de etiquetas",
                description: "Como usuario, quiero poder etiquetar contenido.",
                status: "En Progreso",
                points: "3",
                priority: "Baja"
            },
            {
                id: "US-203",
                title: "Notificaciones push",
                description: "Como usuario, quiero recibir notificaciones en tiempo real.",
                status: "Terminado",
                points: "8",
                priority: "Alta"
            }
        ],
        burndownData: {
            // Simulated data for Sprint 2
            labels: ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5', 'Día 6', 'Día 7', 'Día 8', 'Día 9', 'Día 10'],
            actual: [160, 150, 130, 110, 90, 70, 60, 40, 20, 10],
            ideal: [160, 144, 128, 112, 96, 80, 64, 48, 32, 16, 0]
        },
        userActivity: {
            'Juan': 5,
            'María': 9,
            'Pedro': 7,
            'Ana': 3
        }
    },
    3: {
        stories: [
            {
                id: "US-301",
                title: "Integración con redes sociales",
                description: "Como usuario, quiero compartir contenido en redes sociales.",
                status: "Por Hacer",
                points: "5",
                priority: "Media"
            },
            {
                id: "US-302",
                title: "Sistema de recompensas",
                description: "Como usuario, quiero ganar puntos por mi actividad.",
                status: "En Revisión",
                points: "8",
                priority: "Alta"
            },
            {
                id: "US-303",
                title: "Modo oscuro",
                description: "Como usuario, quiero poder cambiar a modo oscuro.",
                status: "En Progreso",
                points: "3",
                priority: "Baja"
            }
        ],
        burndownData: {
            // Simulated data for Sprint 3
            labels: ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5', 'Día 6', 'Día 7', 'Día 8', 'Día 9', 'Día 10'],
            actual: [140, 135, 130, 120, 110, 100, 85, 70, 55, 40],
            ideal: [140, 126, 112, 98, 84, 70, 56, 42, 28, 14, 0]
        },
        userActivity: {
            'Juan': 6,
            'María': 8,
            'Pedro': 4,
            'Ana': 10
        }
    }
};

// Charts objects
let burndownChart;
let statusChart;
let userActivityChart;

function formatTimestamp() {
    const now = new Date();
    return now.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function addLog(user, action, details = '') {
    const logEntry = {
        timestamp: formatTimestamp(),
        user,
        action,
        details
    };
    logs.push(logEntry);
    updateLogsView();
}

function updateLogsView() {
    const logsTimeline = document.querySelector('.logs-timeline');
    if (!logsTimeline) return;

    logsTimeline.innerHTML = logs.map(log => `
        <div class="log-entry">
            <div class="log-timestamp">[${log.timestamp}]</div>
            <div class="log-action">
                <span class="log-user">${log.user}</span> ${log.action}
            </div>
            ${log.details ? `<div class="log-details">${log.details}</div>` : ''}
        </div>
    `).join('');

    // Auto-scroll to bottom
    logsTimeline.scrollTop = logsTimeline.scrollHeight;
}

// Role switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const roleButtons = document.querySelectorAll('.role-btn');
    const logsBtn = document.getElementById('logs-btn');
    const clearLogsBtn = document.querySelector('.clear-logs-btn');
    const exportLogsBtn = document.querySelector('.export-logs-btn');

    roleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const role = button.dataset.role;
            currentRole = role;
            
            // Update active state
            roleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show/hide logs and stats buttons for assistant view
            const statsBtn = document.querySelector('.view-btn[data-view="stats"]');
            const isAssistant = role === 'assistant';
            
            logsBtn.style.display = isAssistant ? 'flex' : 'none';
            statsBtn.style.display = isAssistant ? 'flex' : 'none';

            // If switching to student view and stats view is active, switch to board view
            if (!isAssistant && document.querySelector('.stats-view').classList.contains('active')) {
                const boardBtn = document.querySelector('.view-btn[data-view="board"]');
                boardBtn.click();
            }
            
            // Add log entry
            addLog('Sistema', `Cambio a vista de ${role === 'student' ? 'estudiante' : 'ayudante'}`);
        });
    });

    // Clear logs functionality
    clearLogsBtn.addEventListener('click', () => {
        logs.length = 0;
        updateLogsView();
        addLog('Sistema', 'Logs limpiados');
    });

    // Export logs functionality
    exportLogsBtn.addEventListener('click', () => {
        const logText = logs.map(log => 
            `[${log.timestamp}] ${log.user} ${log.action}${log.details ? `\n${log.details}` : ''}`
        ).join('\n\n');
        
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scrum-logs-${formatTimestamp().replace(/[/:]/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Add initial log
    addLog('Sistema', 'Aplicación iniciada');

    // Manejo de cambio de vistas
    const viewButtons = document.querySelectorAll('.view-btn');
    const views = document.querySelectorAll('.view');
    const tableBody = document.querySelector('table tbody');

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetView = button.dataset.view;
            
            // Actualizar botones activos
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Mostrar vista seleccionada
            views.forEach(view => {
                if (view.classList.contains(targetView + '-view')) {
                    view.classList.add('active');
                    if (targetView === 'table') {
                        updateTableView();
                    } else if (targetView === 'logs') {
                        updateLogsView();
                    } else if (targetView === 'stats') {
                        updateCharts();
                    }
                } else {
                    view.classList.remove('active');
                }
            });
        });
    });

    // Initialize drag and drop after loading stories
    initializeDragAndDrop();

    // Add event listeners for sprint tabs
    document.querySelectorAll('.sprint-tab').forEach(tab => {
        if (tab.classList.contains('add-sprint')) {
            tab.addEventListener('click', addNewSprint);
        } else {
            tab.addEventListener('click', () => {
                switchSprint(parseInt(tab.dataset.sprint));
                // Reinitialize drag and drop after switching sprints
                initializeDragAndDrop();
            });
        }
    });

    // Move existing stories to Sprint 1
    const existingStories = Array.from(document.querySelectorAll('.story-card')).map(card => ({
        id: card.dataset.id,
        title: card.querySelector('h3').textContent,
        description: card.querySelector('p').textContent,
        status: card.querySelector('.story-status').textContent,
        points: card.querySelector('.story-points').textContent.replace(' pts', ''),
        priority: card.querySelector('.story-priority').textContent
    }));
    sprints[1].stories = existingStories;

    // Initialize charts if stats view is active
    if (document.querySelector('.stats-view').classList.contains('active')) {
        updateCharts();
    }

    // Add event listener for view-buttons to update charts when switching to stats view
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.view === 'stats') {
                updateCharts();
            }
        });
    });
});

function switchSprint(sprintNumber) {
    currentSprint = sprintNumber;
    const sprintTabs = document.querySelectorAll('.sprint-tab');
    sprintTabs.forEach(tab => {
        if (tab.dataset.sprint === sprintNumber.toString()) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Update board and table views
    updateBoardView();
    if (document.querySelector('.table-view').classList.contains('active')) {
        updateTableView();
    } else if (document.querySelector('.stats-view').classList.contains('active')) {
        updateCharts();
    }

    // Add log entry
    addLog('Sistema', `Cambio a Sprint ${sprintNumber}`);
}

function addNewSprint() {
    const newSprintNumber = Object.keys(sprints).length + 1;
    sprints[newSprintNumber] = { stories: [] };
    
    // Create new tab
    const newTab = document.createElement('button');
    newTab.className = 'sprint-tab';
    newTab.dataset.sprint = newSprintNumber;
    newTab.textContent = `Sprint ${newSprintNumber}`;
    
    // Insert before the add sprint button
    const addSprintBtn = document.querySelector('.sprint-tab.add-sprint');
    addSprintBtn.parentNode.insertBefore(newTab, addSprintBtn);
    
    // Add event listener
    newTab.addEventListener('click', () => switchSprint(newSprintNumber));
    
    // Add log entry
    addLog('Sistema', `Nuevo Sprint creado`, `Sprint ${newSprintNumber}`);
}

function updateBoardView() {
    const columns = {
        'En Revisión': document.querySelector('.column:nth-child(1) .stories-container'),
        'Por Hacer': document.querySelector('.column:nth-child(2) .stories-container'),
        'En Progreso': document.querySelector('.column:nth-child(3) .stories-container'),
        'Terminado': document.querySelector('.column:nth-child(4) .stories-container')
    };

    // Clear all columns
    Object.values(columns).forEach(column => {
        column.innerHTML = '';
    });

    // Add stories to their respective columns
    sprints[currentSprint].stories.forEach(story => {
        const column = columns[story.status];
        if (column) {
            const card = document.createElement('div');
            card.className = 'story-card';
            card.dataset.id = story.id;
            card.draggable = true;
            
            card.innerHTML = `
                <div class="story-header">
                    <span class="story-id">${story.id}</span>
                    <span class="story-status">${story.status}</span>
                </div>
                <h3>${story.title}</h3>
                <p>${story.description}</p>
                <div class="story-footer">
                    <span class="story-points">${story.points} pts</span>
                    <span class="story-priority">${story.priority}</span>
                </div>
            `;
            
            column.appendChild(card);
        }
    });

    // Update issue counts
    document.querySelectorAll('.column').forEach(column => {
        const status = column.querySelector('.column-header h2').textContent;
        const count = sprints[currentSprint].stories.filter(story => story.status === status).length;
        column.querySelector('.issue-count').textContent = count;
    });
}

// Hacer las tarjetas arrastrables
function initializeDragAndDrop() {
    const storyCards = document.querySelectorAll('.story-card');
    const containers = document.querySelectorAll('.stories-container');

    storyCards.forEach(card => {
        card.setAttribute('draggable', true);
        
        card.addEventListener('dragstart', (e) => {
            card.classList.add('dragging');
            e.dataTransfer.setData('text/plain', card.dataset.id);
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });
    });

    containers.forEach(container => {
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggable = document.querySelector('.dragging');
            if (draggable) {
                const afterElement = getDragAfterElement(container, e.clientY);
                if (afterElement) {
                    container.insertBefore(draggable, afterElement);
                } else {
                    container.appendChild(draggable);
                }
            }
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggable = document.querySelector('.dragging');
            if (draggable) {
                const newStatus = container.closest('.column').querySelector('.column-header h2').textContent;
                const storyId = draggable.dataset.id;
                const storyTitle = draggable.querySelector('h3').textContent;
                const oldStatus = draggable.querySelector('.story-status').textContent;
                
                // Update status in the data
                const story = sprints[currentSprint].stories.find(s => s.id === storyId);
                if (story) {
                    story.status = newStatus;
                }
                
                // Update status in the card
                draggable.querySelector('.story-status').textContent = newStatus;
                
                // Add log entry
                addLog('Usuario', `Cambió el estado de la historia`, 
                    `Sprint ${currentSprint}\nID: ${storyId}\nTítulo: ${storyTitle}\nDe: ${oldStatus}\nA: ${newStatus}`);
                
                // Update issue counts
                updateIssueCounts();
            }
        });
    });
}

function updateIssueCounts() {
    const columns = document.querySelectorAll('.column');
    columns.forEach(column => {
        const status = column.querySelector('.column-header h2').textContent;
        const count = sprints[currentSprint].stories.filter(story => story.status === status).length;
        column.querySelector('.issue-count').textContent = count;
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.story-card:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Modal functionality
const modalOverlay = document.querySelector('.modal-overlay');
const modal = modalOverlay.querySelector('.modal');
const modalClose = modal.querySelector('.modal-close');
const modalCancel = modal.querySelector('.modal-cancel');
const modalSave = modal.querySelector('.modal-save');
const addCriteriaBtn = modal.querySelector('.add-criteria-btn');
const criteriaList = modal.querySelector('.acceptance-criteria-list');
const statusSelect = modal.querySelector('.edit-status');

function openModal(storyData) {
    modalOverlay.classList.add('active');
    document.body.classList.add('modal-open');
    
    // Llenar el modal con los datos de la historia
    modal.querySelector('.story-id').textContent = storyData.id;
    modal.querySelector('.story-title').textContent = storyData.title;
    modal.querySelector('.edit-title').value = storyData.title;
    modal.querySelector('.edit-description').value = storyData.description;
    modal.querySelector('.edit-status').value = storyData.status;
    modal.querySelector('.edit-points').value = storyData.points;
    modal.querySelector('.edit-priority').value = storyData.priority;
    modal.querySelector('.edit-assignee').value = storyData.assignee || '';

    // Cargar y mostrar los criterios de aceptación
    loadAcceptanceCriteria(storyData.id);
}

function updateAcceptanceCriteriaView(status) {
    const isReview = status === 'En Revisión';
    addCriteriaBtn.style.display = isReview ? 'flex' : 'none';
    
    // Actualizar la visualización de los criterios existentes
    const criteriaItems = criteriaList.querySelectorAll('.criteria-item');
    criteriaItems.forEach(item => {
        const checkbox = item.querySelector('.criteria-checkbox');
        const content = item.querySelector('.criteria-content');
        const actions = item.querySelector('.criteria-actions');

        if (isReview) {
            item.classList.add('editable');
            if (checkbox) checkbox.style.display = 'none';
            actions.style.display = 'flex';
        } else {
            item.classList.remove('editable');
            if (checkbox) checkbox.style.display = 'flex';
            actions.style.display = 'none';
        }
    });
}

function createCriteriaItem(criteria, isReview) {
    const item = document.createElement('div');
    item.className = `criteria-item ${isReview ? 'editable' : ''}`;
    
    if (!isReview) {
        const checkbox = document.createElement('div');
        checkbox.className = 'criteria-checkbox';
        checkbox.innerHTML = criteria.status === 'accepted' ? '<i class="fas fa-check"></i>' : 
                           criteria.status === 'rejected' ? '<i class="fas fa-times"></i>' : '';
        if (criteria.status) {
            checkbox.classList.add(criteria.status);
        }
        
        checkbox.addEventListener('click', () => {
            if (!checkbox.classList.contains('accepted') && !checkbox.classList.contains('rejected')) {
                checkbox.classList.add('accepted');
                checkbox.innerHTML = '<i class="fas fa-check"></i>';
            } else if (checkbox.classList.contains('accepted')) {
                checkbox.classList.remove('accepted');
                checkbox.classList.add('rejected');
                checkbox.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                checkbox.classList.remove('rejected');
                checkbox.innerHTML = '';
            }
        });
        
        item.appendChild(checkbox);
    }
    
    const content = document.createElement('div');
    content.className = 'criteria-content';
    
    if (isReview) {
        const input = document.createElement('textarea');
        input.className = 'criteria-input';
        input.value = criteria.text;
        input.rows = 1;
        input.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
        content.appendChild(input);
    } else {
        const text = document.createElement('div');
        text.className = 'criteria-text';
        text.textContent = criteria.text;
        content.appendChild(text);
    }

    const actions = document.createElement('div');
    actions.className = 'criteria-actions';
    
    if (isReview) {
        actions.innerHTML = `
            <button class="criteria-action-btn save-btn" title="Guardar">
                <i class="fas fa-save"></i>
            </button>
            <button class="criteria-action-btn delete-btn" title="Eliminar">
                <i class="fas fa-trash"></i>
            </button>
        `;
        item.appendChild(content);
        item.appendChild(actions);
    } else {
        item.appendChild(content);
    }

    return item;
}

function loadAcceptanceCriteria(storyId) {
    criteriaList.innerHTML = '';
    const isReview = statusSelect.value === 'En Revisión';
    
    // Obtener los criterios de aceptación para esta historia
    const storyCriteria = acceptanceCriteria[storyId] || [];
    
    storyCriteria.forEach(criteria => {
        const item = createCriteriaItem(criteria, isReview);
        criteriaList.appendChild(item);
    });

    // Actualizar la vista de los criterios según el estado
    updateAcceptanceCriteriaView(statusSelect.value);
}

// Event listener para el cambio de estado
statusSelect.addEventListener('change', (e) => {
    const storyId = modal.querySelector('.story-id').textContent;
    updateAcceptanceCriteriaView(e.target.value);
    loadAcceptanceCriteria(storyId);
});

// Event listener para agregar nuevo criterio
addCriteriaBtn.addEventListener('click', () => {
    const newCriteria = { text: '', isNew: true };
    const item = createCriteriaItem(newCriteria, true);
    criteriaList.appendChild(item);
    item.querySelector('.criteria-input').focus();
});

// Event delegation para los botones de acción de criterios
criteriaList.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('.criteria-action-btn');
    if (!actionBtn) return;

    const criteriaItem = actionBtn.closest('.criteria-item');
    
    if (actionBtn.classList.contains('delete-btn')) {
        criteriaItem.remove();
    } else if (actionBtn.classList.contains('save-btn')) {
        const input = criteriaItem.querySelector('.criteria-input');
        const text = input.value.trim();
        
        if (text) {
            const content = criteriaItem.querySelector('.criteria-content');
            content.innerHTML = `<div class="criteria-text">${text}</div>`;
        }
    }
});

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.classList.remove('modal-open');
}

function getStoryData(element) {
    const isCard = element.classList.contains('story-card');
    const card = isCard ? element : element.closest('tr');
    
    return {
        id: card.dataset.id || card.querySelector('.story-id').textContent,
        title: card.querySelector('h3')?.textContent || card.querySelector('td:nth-child(2)').textContent,
        description: card.querySelector('p')?.textContent || '',
        status: card.querySelector('.story-status')?.textContent || card.querySelector('.status-badge').textContent,
        points: (card.querySelector('.story-points')?.textContent || card.querySelector('td:nth-child(4)').textContent).replace(' pts', ''),
        priority: card.querySelector('.story-priority')?.textContent || card.querySelector('.priority-badge').textContent,
        assignee: card.querySelector('td:nth-child(6)')?.textContent || ''
    };
}

// Event listeners para el modal
modalClose.addEventListener('click', closeModal);
modalCancel.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Abrir modal al hacer click en una tarjeta
document.addEventListener('click', (e) => {
    const card = e.target.closest('.story-card');
    const row = e.target.closest('tr');
    
    if (card || (row && row.parentElement.tagName === 'TBODY')) {
        const storyData = getStoryData(card || row);
        openModal(storyData);
    }
});

modalSave.addEventListener('click', () => {
    // Aquí iría la lógica para guardar los cambios
    // Por ahora solo cerramos el modal
    closeModal();
});

// Función para actualizar la vista de tabla
function updateTableView() {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = '';

    sprints[currentSprint].stories.forEach(story => {
        const row = document.createElement('tr');
        row.dataset.id = story.id;
        
        row.innerHTML = `
            <td>${story.id}</td>
            <td>${story.title}</td>
            <td><span class="status-badge ${story.status.toLowerCase().replace(' ', '-')}">${story.status}</span></td>
            <td>${story.points}</td>
            <td><span class="priority-badge ${story.priority.toLowerCase()}">${story.priority}</span></td>
            <td>Sin asignar</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Criterios de aceptación de ejemplo
const acceptanceCriteria = {
    'US-001': [
        {
            text: 'Dado un usuario no autenticado, cuando intenta acceder a una página protegida, entonces es redirigido al formulario de login',
            status: 'pending'
        },
        {
            text: 'Dado un usuario con credenciales válidas, cuando ingresa su email y contraseña, entonces accede al sistema',
            status: 'pending'
        },
        {
            text: 'Dado un usuario con credenciales inválidas, cuando intenta iniciar sesión, entonces recibe un mensaje de error',
            status: 'pending'
        }
    ],
    'US-002': [
        {
            text: 'Dado un usuario que accede al sistema, cuando navega por la interfaz, entonces ve un diseño moderno y responsivo',
            status: 'pending'
        },
        {
            text: 'Dado un usuario en cualquier dispositivo, cuando carga la aplicación, entonces la interfaz se adapta al tamaño de la pantalla',
            status: 'pending'
        },
        {
            text: 'Dado un usuario que interactúa con los elementos, cuando realiza acciones, entonces recibe feedback visual inmediato',
            status: 'pending'
        }
    ],
    'US-003': [
        {
            text: 'Dado un sistema con alta carga de datos, cuando se realizan consultas complejas, entonces el tiempo de respuesta es menor a 2 segundos',
            status: 'pending'
        },
        {
            text: 'Dado un administrador del sistema, cuando ejecuta operaciones en lote, entonces la base de datos mantiene su integridad',
            status: 'pending'
        },
        {
            text: 'Dado un usuario que realiza búsquedas, cuando filtra resultados, entonces la respuesta es instantánea',
            status: 'pending'
        }
    ],
    'US-004': [
        {
            text: 'Dado un desarrollador nuevo, cuando clona el repositorio, entonces puede ejecutar el proyecto localmente',
            status: 'pending'
        },
        {
            text: 'Dado un entorno de desarrollo, cuando se ejecutan las pruebas, entonces todas pasan correctamente',
            status: 'pending'
        },
        {
            text: 'Dado un sistema configurado, cuando se despliega en producción, entonces funciona sin errores',
            status: 'pending'
        }
    ],
    'US-012': [
        {
            text: 'Dado un usuario nuevo, cuando completa el formulario de registro, entonces recibe un email de confirmación',
            status: 'pending'
        },
        {
            text: 'Dado un usuario que intenta registrarse, cuando ingresa un email ya existente, entonces recibe un mensaje de error',
            status: 'pending'
        },
        {
            text: 'Dado un usuario que confirma su email, cuando inicia sesión por primera vez, entonces debe cambiar su contraseña',
            status: 'pending'
        }
    ],
    'US-013': [
        {
            text: 'Dado un usuario que olvidó su contraseña, cuando solicita recuperación, entonces recibe un email con instrucciones',
            status: 'pending'
        },
        {
            text: 'Dado un usuario con token válido, cuando establece nueva contraseña, entonces puede acceder al sistema',
            status: 'pending'
        },
        {
            text: 'Dado un usuario con token expirado, cuando intenta recuperar contraseña, entonces debe solicitar un nuevo token',
            status: 'pending'
        }
    ],
    'US-014': [
        {
            text: 'Dado un usuario que accede al sistema, cuando llega a la página de inicio, entonces ve un resumen de sus actividades',
            status: 'pending'
        },
        {
            text: 'Dado un usuario autenticado, cuando visita la landing page, entonces ve sus proyectos recientes',
            status: 'pending'
        },
        {
            text: 'Dado un usuario con permisos de administrador, cuando accede a la landing page, entonces ve estadísticas del sistema',
            status: 'pending'
        }
    ],
    'US-015': [
        {
            text: 'Dado un usuario navegando el sistema, cuando interactúa con el menú, entonces encuentra todas las secciones principales',
            status: 'pending'
        },
        {
            text: 'Dado un usuario en cualquier página, cuando necesita navegar, entonces el menú está siempre accesible',
            status: 'pending'
        },
        {
            text: 'Dado un usuario en móvil, cuando abre el menú, entonces se despliega de forma responsiva',
            status: 'pending'
        }
    ],
    'US-016': [
        {
            text: 'Dado un usuario en cualquier página, cuando llega al final, entonces ve información de contacto y enlaces útiles',
            status: 'pending'
        },
        {
            text: 'Dado un usuario en diferentes dispositivos, cuando ve el footer, entonces se adapta correctamente',
            status: 'pending'
        },
        {
            text: 'Dado un usuario que necesita ayuda, cuando revisa el footer, entonces encuentra enlaces de soporte',
            status: 'pending'
        }
    ],
    'US-017': [
        {
            text: 'Dado un administrador del sistema, cuando accede a la configuración de emails, entonces puede personalizar las plantillas',
            status: 'pending'
        },
        {
            text: 'Dado un administrador que modifica una plantilla, cuando guarda los cambios, entonces los emails se envían con el nuevo formato',
            status: 'pending'
        },
        {
            text: 'Dado un usuario que recibe un email, cuando lo abre, entonces ve el contenido formateado correctamente',
            status: 'pending'
        }
    ]
};

// Create and update charts
function updateCharts() {
    const sprintData = sprints[currentSprint];
    document.querySelector('.current-sprint-number').textContent = currentSprint;
    
    // Update summary statistics
    updateSummaryStats();
    
    // Burndown Chart
    const burndownCtx = document.getElementById('burndownChart').getContext('2d');
    
    // Destroy previous chart if it exists
    if (burndownChart) {
        burndownChart.destroy();
    }
    
    burndownChart = new Chart(burndownCtx, {
        type: 'line',
        data: {
            labels: sprintData.burndownData.labels,
            datasets: [
                {
                    label: 'Puntos restantes reales',
                    data: sprintData.burndownData.actual,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Puntos restantes estimados',
                    data: sprintData.burndownData.ideal,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Puntos de Historia Restantes'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Días del Sprint'
                    }
                }
            }
        }
    });
    
    // Status Chart
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    
    // Count stories by status
    const statusCounts = {
        'En Revisión': 0,
        'Por Hacer': 0,
        'En Progreso': 0,
        'Terminado': 0
    };
    
    sprintData.stories.forEach(story => {
        if (statusCounts.hasOwnProperty(story.status)) {
            statusCounts[story.status]++;
        }
    });
    
    // Destroy previous chart if it exists
    if (statusChart) {
        statusChart.destroy();
    }
    
    statusChart = new Chart(statusCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
    
    // User Activity Chart
    const userActivityCtx = document.getElementById('userActivityChart').getContext('2d');
    
    // Destroy previous chart if it exists
    if (userActivityChart) {
        userActivityChart.destroy();
    }
    
    userActivityChart = new Chart(userActivityCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(sprintData.userActivity),
            datasets: [{
                label: 'Acciones',
                data: Object.values(sprintData.userActivity),
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de acciones'
                    }
                }
            }
        }
    });
}

function updateSummaryStats() {
    const sprintData = sprints[currentSprint];
    const totalStories = sprintData.stories.length;
    const completedStories = sprintData.stories.filter(story => story.status === 'Terminado').length;
    
    // Calculate total and completed points
    let totalPoints = 0;
    let completedPoints = 0;
    
    sprintData.stories.forEach(story => {
        const points = parseInt(story.points);
        totalPoints += points;
        
        if (story.status === 'Terminado') {
            completedPoints += points;
        }
    });
    
    const completionPercentage = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;
    
    // Update DOM elements
    document.getElementById('totalStories').textContent = totalStories;
    document.getElementById('totalPoints').textContent = totalPoints;
    document.getElementById('completedStories').textContent = completedStories;
    document.getElementById('completedPoints').textContent = completedPoints;
    document.getElementById('completionPercentage').textContent = `${completionPercentage}%`;
} 