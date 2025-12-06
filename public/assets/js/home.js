// ==========================================
// VARIÁVEIS GLOBAIS
// ==========================================
let cardObras = []; // Array principal para Cards e Galeria
let slideObras = []; // Array exclusivo para Slides (Carrossel)
let currentSlide = 0;
let editingId = null;
let carouselInterval = null;
let isDevMode = false;

// Easter Eggs
let logoClickCount = 0;
let konamiIndex = 0;
let rainbowMode = false;
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// URLs das imagens (Sugestões, troque se tiver as suas próprias)
const MONA_LISA_URL = 'https://i.imgur.com/gK2T3gG.jpg';
const O_GRITO_URL = 'https://i.imgur.com/9n0Q0Xm.jpg';
const ABAPORU_URL = 'https://i.imgur.com/kS5sM5D.jpg';

// Dados Padrão (Usado para carregar a primeira vez)
const DADOS_PADRAO = [
    { 
        id: 1, 
        titulo: 'Mona Lisa', 
        artista: 'Leonardo da Vinci', 
        descricao: 'A pintura mais famosa do mundo, conhecida por seu sorriso enigmático.', 
        imagem: MONA_LISA_URL, 
        favorito: false 
    },
    { 
        id: 2, 
        titulo: 'O Grito', 
        artista: 'Edvard Munch', 
        descricao: 'Expressão icônica de angústia e desespero existencial.', 
        imagem: O_GRITO_URL, 
        favorito: false 
    },
    { 
        id: 3, 
        titulo: 'Abaporu', 
        artista: 'Tarsila do Amaral', 
        descricao: 'Obra-prima do modernismo brasileiro, símbolo do movimento antropofágico.', 
        imagem: ABAPORU_URL, 
        favorito: false 
    }
];

// ==========================================
// INICIALIZAÇÃO
// ==========================================
function init() {
    loadObras();
    setupEventListeners();
    renderCarousel();
    renderObras(cardObras); // Usa o array completo inicialmente
    startCarouselAutoPlay();
    updateCounts();
    updateDevStatus(); 
    
    // Mostra a tab "Todas as Obras" por padrão
    showTab('all'); 
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    document.getElementById('logo').addEventListener('click', handleLogoClick);
    document.addEventListener('keydown', handleKeyPress);
    
    // NOVO: Adiciona a escuta para o campo de pesquisa
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterObras);
    }
    
    const devPasswordInput = document.getElementById('devPassword');
    if (devPasswordInput) {
        devPasswordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleDevLogin();
            }
        });
    }

    const addObraBtn = document.getElementById('btnAddObra');
    if (addObraBtn) {
        addObraBtn.addEventListener('click', () => {
            if (isDevMode) {
                // Chama o modal específico para Card
                openCardModal(null); 
            } else {
                alert('🔒 Faça login como desenvolvedor para adicionar obras! (Clique 7x na logo)');
            }
        });
    }

    // Adiciona escuta para o botão de Logout (se ele tiver o ID)
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// ==========================================
// EASTER EGG: CLIQUES NA LOGO & KONAMI
// ==========================================
function handleLogoClick() {
    logoClickCount++;
    const counter = document.getElementById('clickCounter');
    
    if (logoClickCount < 7) {
        counter.textContent = `(${logoClickCount}/7)`;
        counter.classList.add('visible');
    }
    
    if (logoClickCount === 7) {
        openDevLogin();
        logoClickCount = 0;
        counter.textContent = '';
        counter.classList.remove('visible');
    }
}

function handleKeyPress(e) {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            ativarKonamiCode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
    
    if (e.key === 'Escape') {
        closeModal();
        closeDevLogin();
    }
    
    if (e.key === 'ArrowLeft' && document.getElementById('carouselTrack')) {
        prevSlide();
    } else if (e.key === 'ArrowRight' && document.getElementById('carouselTrack')) {
        nextSlide();
    }
}

function ativarKonamiCode() {
    rainbowMode = !rainbowMode;
    const header = document.getElementById('header');
    
    if (rainbowMode) {
        header.classList.add('rainbow-mode');
    } else {
        header.classList.remove('rainbow-mode');
    }
    
    const notification = document.getElementById('easterEggNotification');
    if (notification) {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
}

// ==========================================
// LOGIN DE DESENVOLVEDOR / STATUS
// ==========================================
function openDevLogin() {
    const devLoginModal = document.getElementById('devLoginModal');
    const devPasswordInput = document.getElementById('devPassword');

    if (devLoginModal) {
        devLoginModal.classList.add('active');
    }
    if (devPasswordInput) {
        devPasswordInput.focus();
    }
}

function closeDevLogin() {
    const devLoginModal = document.getElementById('devLoginModal');
    const devPasswordInput = document.getElementById('devPassword');

    if (devLoginModal) {
        devLoginModal.classList.remove('active');
    }
    if (devPasswordInput) {
        devPasswordInput.value = '';
    }
}

function updateDevStatus() {
    const userNameEl = document.getElementById('userName');
    const devBadgeEl = document.getElementById('devBadge');
    const devStatusEl = document.getElementById('devStatus');

    if (userNameEl) {
        userNameEl.textContent = isDevMode ? '👨‍💻 Dev Master' : 'Visitante';
    }
    if (devBadgeEl) {
        devBadgeEl.classList[isDevMode ? 'add' : 'remove']('active');
    }
    if(devStatusEl) {
        devStatusEl.style.display = isDevMode ? 'block' : 'none'; 
    }
}

function updateCrudVisibility() {
    const btnAddObra = document.getElementById('btnAddObra');
    
    if (btnAddObra) {
        btnAddObra.style.display = isDevMode ? 'flex' : 'none'; 
    }
}

function handleDevLogin() {
    const password = document.getElementById('devPassword').value;
    
    if (password === 'tarsila2024' || password === 'modernismo') {
        isDevMode = true;
        updateDevStatus();
        updateCrudVisibility(); 
        closeDevLogin();
        alert('🎉 Modo Desenvolvedor Ativado! Agora você pode gerenciar tudo!');
        renderObras(cardObras); 
        renderCarousel(); 
    } else {
        alert('❌ Senha incorreta! Dica: pense na artista brasileira... 🎨');
        document.getElementById('devPassword').value = '';
    }
}

// ==========================================
// GERENCIAMENTO DE DADOS (Inicialização/Persistência)
// ==========================================
function loadObras() {
    const storedCards = localStorage.getItem('cardObras');
    if (storedCards) {
        cardObras = JSON.parse(storedCards);
    } else {
        cardObras = [...DADOS_PADRAO];
    }
    
    const storedSlides = localStorage.getItem('slideObras');
    if (storedSlides) {
        slideObras = JSON.parse(storedSlides);
    } else {
        // Usa uma cópia dos dados padrão para slides também
        slideObras = [...DADOS_PADRAO]; 
    }
    
    saveObras();
}

function saveObras() {
    localStorage.setItem('cardObras', JSON.stringify(cardObras));
    localStorage.setItem('slideObras', JSON.stringify(slideObras));
}

function updateCounts() {
    const todasCountEl = document.getElementById('todasCount');
    const favoritosCountEl = document.getElementById('favoritosCount');
    
    if (todasCountEl) todasCountEl.textContent = cardObras.length;
    if (favoritosCountEl) favoritosCountEl.textContent = cardObras.filter(o => o.favorito).length;
    
    updateCrudVisibility(); 
}

// ==========================================
// CARROSSEL (CRUD SLIDE)
// ==========================================
function renderCarousel() {
    const track = document.getElementById('carouselTrack');
    const obrasParaSlide = slideObras; 
    
    if (!track) return;
    
    if (obrasParaSlide.length === 0) {
        track.innerHTML = `
            <div class="carousel-slide">
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: rgba(255,255,255,0.05); text-align: center; padding: 20px;">
                    <p style="color: #9aa4b2; font-size: 1.2rem; margin-bottom: 15px;">Nenhuma obra em destaque.</p>
                    ${isDevMode ? `<button class="btn-primary" onclick="openSlideModal(null)">➕ Adicionar Slide</button>` : ''}
                </div>
            </div>
        `;
        return;
    }
    
    track.innerHTML = obrasParaSlide.map(obra => `
        <div class="carousel-slide">
            <img 
                src="${obra.imagem}" 
                alt="${obra.titulo}" 
                onerror="this.src='https://via.placeholder.com/800x500/1a1a1a/666666?text=Imagem+nao+encontrada'"
            >
            <div class="carousel-caption">
                <h3>${obra.titulo}</h3>
                <p>${obra.artista}</p>
                ${isDevMode ? `
                    <div class="slide-actions">
                        <button class="btn-edit-slide" onclick="openSlideModal(${obra.id})">⚙️ Editar Slide</button>
                        <button class="btn-delete-slide" onclick="deleteSlide(${obra.id})">❌ Excluir Slide</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    updateCarousel(obrasParaSlide.length);
}

function updateCarousel(length = slideObras.length) {
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    
    if (currentSlide >= slideObras.length && slideObras.length > 0) {
        currentSlide = slideObras.length - 1;
    } else if (slideObras.length === 0) {
        currentSlide = 0;
    }

    const offset = currentSlide * 100;
    track.style.transform = `translateX(-${offset}%)`;
}

function nextSlide() {
    if (slideObras.length === 0) return;
    currentSlide = (currentSlide + 1) % slideObras.length;
    updateCarousel();
}

function prevSlide() {
    if (slideObras.length === 0) return;
    currentSlide = (currentSlide - 1 + slideObras.length) % slideObras.length;
    updateCarousel();
}

function startCarouselAutoPlay() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
    
    carouselInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

function openSlideModal(id = null) {
    if (!isDevMode) return;
    editingId = id;
    const modal = document.getElementById('modal');

    document.getElementById('modalTitle').textContent = id ? 'Editar Slide' : 'Adicionar Novo Slide';
    document.getElementById('obraType').value = 'slide';

    document.getElementById('obraTitulo').value = '';
    document.getElementById('obraArtista').value = '';
    document.getElementById('obraDescricao').value = '';
    document.getElementById('obraImagem').value = '';
    
    if (id) {
        const obra = slideObras.find(o => o.id === id);
        if (!obra) return; 
        document.getElementById('obraTitulo').value = obra.titulo;
        document.getElementById('obraArtista').value = obra.artista;
        document.getElementById('obraDescricao').value = obra.descricao;
        document.getElementById('obraImagem').value = obra.imagem;
    }
    
    if(modal) modal.classList.add('active');
    const obraTituloInput = document.getElementById('obraTitulo');
    if(obraTituloInput) obraTituloInput.focus();
}

function deleteSlide(id) {
    if (!isDevMode) return alert('🔒 Apenas desenvolvedores podem excluir slides!');
    if (confirm('⚠️ Tem certeza que deseja excluir este Slide do carrossel?')) {
        slideObras = slideObras.filter(o => o.id !== id);
        saveObras();
        renderCarousel(); 
        alert('🗑️ Slide excluído com sucesso!');
    }
}

// ==========================================
// FUNÇÃO DE FILTRAGEM DE PESQUISA (AGORA CONECTADA)
// ==========================================
function filterObras() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase().trim();
    
    // Filtra o array principal cardObras
    const filteredObras = cardObras.filter(obra => {
        return obra.titulo.toLowerCase().includes(searchTerm) || 
               obra.artista.toLowerCase().includes(searchTerm) ||
               obra.descricao.toLowerCase().includes(searchTerm); // Adicionado busca por descrição/tags
    });
    
    // Renderiza a lista filtrada
    renderObras(filteredObras);
    
    // Garante que a aba "Todas as Obras" esteja ativa ao pesquisar
    showTab('all');
}

// ==========================================
// RENDERIZAÇÃO DE CARDS (CRUD GALERIA)
// ==========================================
function renderObras(obrasToRender = cardObras) {
    const grid = document.getElementById('obrasGrid');
    if (!grid) return;
    
    const searchTerm = document.getElementById('searchInput').value.trim();
    const isSearchEmpty = searchTerm === '';

    if (obrasToRender.length === 0) {
        // Estado vazio, ajustado para pesquisa
        grid.innerHTML = `
            <div class="empty-state">
                <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                <h3>${!isSearchEmpty ? 'Nenhum resultado encontrado' : 'Nenhuma obra cadastrada'}</h3>
                <p>${!isSearchEmpty ? `Sua busca por "**${searchTerm}**" não retornou resultados.` : (isDevMode ? 'Use o botão "Adicionar Card" para começar.' : 'Faça login no modo Dev para adicionar obras.')}</p>
            </div>
        `;
    } else {
        grid.innerHTML = obrasToRender.map(obra => `
            <div class="obra-card">
                <img 
                    src="${obra.imagem}" 
                    alt="${obra.titulo}" 
                    onerror="this.src='https://via.placeholder.com/300x250/1a1a1a/666666?text=Imagem+nao+encontrada'"
                >
                <div class="obra-info">
                    <h3>${obra.titulo} (ID: ${obra.id})</h3>
                    <p><strong>${obra.artista}</strong></p>
                    <p>${obra.descricao}</p>
                    <div class="obra-actions">
                        
                        <button class="btn-icon btn-favorite ${obra.favorito ? 'active' : ''}" 
                                onclick="event.stopPropagation(); toggleFavorite(${obra.id})">
                            <svg viewBox="0 0 24 24" fill="${obra.favorito ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
                            </svg>
                            Favorito
                        </button>
                        
                        ${isDevMode ? `
                            <button class="btn-icon btn-edit" onclick="event.stopPropagation(); openCardModal(${obra.id})">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                                Editar
                            </button>
                            <button class="btn-icon btn-delete" onclick="event.stopPropagation(); deleteCard(${obra.id})">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                                </svg>
                                Excluir
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    renderFavoritos();
    updateCounts();
}

function renderFavoritos() {
    const grid = document.getElementById('favoritosGrid');
    if (!grid) return;
    
    const favoritos = cardObras.filter(o => o.favorito); 
    
    if (favoritos.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <h3>Nenhuma obra favorita</h3>
                <p>Clique no coração para adicionar uma obra aqui.</p>
            </div>
        `;
    } else {
        grid.innerHTML = favoritos.map(obra => {
            return `
               <div class="obra-card">
                    <img src="${obra.imagem}" alt="${obra.titulo}" onerror="this.src='https://via.placeholder.com/300x250/1a1a1a/666666?text=Imagem+nao+encontrada'">
                    <div class="obra-info">
                        <h3>${obra.titulo} (ID: ${obra.id})</h3>
                        <p><strong>${obra.artista}</strong></p>
                        <p>${obra.descricao}</p>
                        <div class="obra-actions">
                            
                            <button class="btn-icon btn-favorite active" 
                                    onclick="event.stopPropagation(); toggleFavorite(${obra.id})">
                                <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518-.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
                                </svg>
                                Favorito
                            </button>
                            ${isDevMode ? `
                                <button class="btn-icon btn-edit" onclick="event.stopPropagation(); openCardModal(${obra.id})">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                    </svg>
                                    Editar
                                </button>
                                <button class="btn-icon btn-delete" onclick="event.stopPropagation(); deleteCard(${obra.id})">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                                    </svg>
                                    Excluir
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function toggleFavorite(id) {
    const obra = cardObras.find(o => o.id === id);
    if (obra) {
        obra.favorito = !obra.favorito;
        saveObras();
        
        // Verifica se há um termo de pesquisa ativo e re-filtra a lista de todas as obras
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        if (searchTerm) {
            filterObras(); // Atualiza a galeria filtrada
        } else {
            renderObras(cardObras); // Atualiza a galeria completa
        }
        
        renderFavoritos();
        updateCounts();
    }
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    const targetTabContent = document.getElementById(tabId + 'Tab');
    const targetTabButton = document.querySelector(`.tab[onclick="showTab('${tabId}')"]`);
    
    if (targetTabContent) targetTabContent.classList.add('active');
    if (targetTabButton) targetTabButton.classList.add('active');
}

// ==========================================
// CRUD CARD DEDICADO
// ==========================================
function openCardModal(id = null) {
    if (!isDevMode) return;
    editingId = id;
    const modal = document.getElementById('modal');

    document.getElementById('modalTitle').textContent = id ? 'Editar Card' : 'Adicionar Novo Card';
    document.getElementById('obraType').value = 'card';

    document.getElementById('obraTitulo').value = '';
    document.getElementById('obraArtista').value = '';
    document.getElementById('obraDescricao').value = '';
    document.getElementById('obraImagem').value = '';

    if (id) {
        const obra = cardObras.find(o => o.id === id);
        if (!obra) return; 
        document.getElementById('obraTitulo').value = obra.titulo;
        document.getElementById('obraArtista').value = obra.artista;
        document.getElementById('obraDescricao').value = obra.descricao;
        document.getElementById('obraImagem').value = obra.imagem;
    }
    
    if(modal) modal.classList.add('active');
    const obraTituloInput = document.getElementById('obraTitulo');
    if(obraTituloInput) obraTituloInput.focus();
}

function deleteCard(id) {
    if (!isDevMode) return alert('🔒 Apenas desenvolvedores podem excluir cards!');
    if (confirm('⚠️ Tem certeza que deseja excluir este Card da galeria?')) {
        cardObras = cardObras.filter(o => o.id !== id);
        saveObras();
        
        // Renderiza com ou sem o termo de pesquisa atual
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        if (searchTerm) {
            filterObras();
        } else {
            renderObras(cardObras); 
        }

        alert('🗑️ Card excluído com sucesso!');
    }
}

// ==========================================
// CRUD GERAL (CREATE/UPDATE - Ações Salvar e Fechar)
// ==========================================
function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.classList.remove('active');
    editingId = null;
    const obraType = document.getElementById('obraType');
    if (obraType) obraType.value = 'card'; 
}

function saveObra() {
    if (!isDevMode) {
        alert('🔒 Você precisa estar no modo Dev para salvar alterações!');
        return;
    }

    const type = document.getElementById('obraType').value;
    let targetArray = type === 'slide' ? slideObras : cardObras; 
    let renderFunction = type === 'slide' ? renderCarousel : renderObras;

    const obraData = {
        titulo: document.getElementById('obraTitulo').value.trim(),
        artista: document.getElementById('obraArtista').value.trim(),
        descricao: document.getElementById('obraDescricao').value.trim(),
        imagem: document.getElementById('obraImagem').value.trim(),
    };

    if (!obraData.titulo || !obraData.artista || !obraData.descricao || !obraData.imagem) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    if (editingId) {
        const index = targetArray.findIndex(o => o.id === editingId);
        if (index !== -1) {
            targetArray[index] = { 
                ...targetArray[index], 
                ...obraData 
            };
        }
    } else {
        targetArray.push({
            id: Date.now(),
            ...obraData,
            favorito: false, 
        });
    }

    saveObras();
    if (type === 'card') {
        // Após salvar um card, re-renderiza com o filtro de pesquisa ativo, se houver
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        if (searchTerm && !editingId) { // Se for um novo card e tiver filtro, renderiza o filtro
            filterObras(); 
        } else {
            renderObras(cardObras);
        }
    } else {
        renderFunction();
    }
    
    closeModal();
    
    const msg = editingId ? `✅ ${type.toUpperCase()} atualizado com sucesso!` : `✅ ${type.toUpperCase()} adicionado com sucesso!`;
    alert(msg);
}

// Funções de Edição genéricas que delegam ao tipo correto
function editObra(id) {
    const isSlideCheck = slideObras.some(o => o.id === id);
    if (isSlideCheck) {
        openSlideModal(id);
    } else {
        openCardModal(id);
    }
}
function deleteObra(id) {
    const isSlideCheck = slideObras.some(o => o.id === id);
    if (isSlideCheck) {
        deleteSlide(id);
    } else {
        deleteCard(id);
    }
}


// ==========================================
// LOGOUT
// ==========================================
function logout() {
    if (confirm('⚠️ Deseja sair da sua conta?')) {
        isDevMode = false;
        updateDevStatus(); 
        updateCrudVisibility(); 
        
        if (rainbowMode) {
            rainbowMode = false;
            const header = document.getElementById('header');
            if(header) header.classList.remove('rainbow-mode');
        }
        
        // Limpa o campo de pesquisa ao sair para garantir a lista completa
        const searchInput = document.getElementById('searchInput');
        if(searchInput) searchInput.value = '';

        // Renderiza com a lista completa, sem filtro de pesquisa
        renderObras(cardObras); 
        renderCarousel(); 
        alert('👋 Logout realizado com sucesso!');
    }
}

// ==========================================
// INICIAR APLICAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', init);