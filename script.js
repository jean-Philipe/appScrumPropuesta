document.addEventListener('DOMContentLoaded', function() {
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
                    }
                } else {
                    view.classList.remove('active');
                }
            });
        });
    });

    // Hacer las tarjetas arrastrables
    const storyCards = document.querySelectorAll('.story-card');
    const containers = document.querySelectorAll('.stories-container');

    storyCards.forEach(card => {
        card.setAttribute('draggable', true);
        
        card.addEventListener('dragstart', (e) => {
            card.classList.add('dragging');
            e.dataTransfer.setData('text/plain', card.innerHTML);
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
    });

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

    // Actualizar contadores de issues
    function updateIssueCounts() {
        const columns = document.querySelectorAll('.column');
        columns.forEach(column => {
            const count = column.querySelectorAll('.story-card').length;
            column.querySelector('.issue-count').textContent = count;
        });
    }

    // Llamar a updateIssueCounts cuando se mueven las tarjetas
    storyCards.forEach(card => {
        card.addEventListener('dragend', updateIssueCounts);
    });

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
        const cards = document.querySelectorAll('.story-card');
        tableBody.innerHTML = '';
        
        cards.forEach(card => {
            const data = getStoryData(card);
            const row = document.createElement('tr');
            row.dataset.id = data.id;
            
            row.innerHTML = `
                <td>${data.id}</td>
                <td>${data.title}</td>
                <td><span class="status-badge ${data.status.toLowerCase().replace(' ', '-')}">${data.status}</span></td>
                <td>${data.points}</td>
                <td><span class="priority-badge ${data.priority.toLowerCase()}">${data.priority}</span></td>
                <td>${data.assignee || 'Sin asignar'}</td>
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
}); 