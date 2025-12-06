// ==========================================
// VARIÁVEIS GLOBAIS
// ==========================================
let obras = [];
let currentSlide = 0;
let editingId = null;
let carouselInterval = null;
let isDevMode = false;

// Easter Eggs
let logoClickCount = 0;
let konamiIndex = 0;
let rainbowMode = false;
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// ==========================================
// INICIALIZAÇÃO
// ==========================================
function init() {
    loadObras();
    setupEventListeners();
    renderCarousel();
    renderObras();
    startCarouselAutoPlay();
    updateCounts();
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    document.getElementById('logo').addEventListener('click', handleLogoClick);
    document.addEventListener('keydown', handleKeyPress);
    document.getElementById('devPassword').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleDevLogin();
        }
    });
}

// ==========================================
// EASTER EGG: CLIQUES NA LOGO
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

// ==========================================
// EASTER EGG: KONAMI CODE
// ==========================================
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
    
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
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
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
    
    if (!obras.some(o => o.titulo.includes('Easter Egg'))) {
        obras.push(obraSecreta);
        saveObras();
        renderCarousel();
        renderObras();
        updateCounts();
    }
}

// ==========================================
// LOGIN DE DESENVOLVEDOR
// ==========================================
function openDevLogin() {
    document.getElementById('devLoginModal').classList.add('active');
    document.getElementById('devPassword').focus();
}

function closeDevLogin() {
    document.getElementById('devLoginModal').classList.remove('active');
    document.getElementById('devPassword').value = '';
}

function handleDevLogin() {
    const password = document.getElementById('devPassword').value;
    
    if (password === 'tarsila2024' || password === 'modernismo') {
        isDevMode = true;
        document.getElementById('userName').textContent = '👨‍💻 Dev Master';
        document.getElementById('devBadge').classList.add('active');
        document.getElementById('devStatus').classList.add('active');
        closeDevLogin();
        alert('🎉 Modo Desenvolvedor Ativado! Agora você pode editar tudo!');
        renderObras();
    } else {
        alert('❌ Senha incorreta! Dica: pense na artista brasileira... 🎨');
        document.getElementById('devPassword').value = '';
    }
}

// ==========================================
// GERENCIAMENTO DE OBRAS
// ==========================================
function loadObras() {
    const stored = localStorage.getItem('obras');
    if (stored) {
        obras = JSON.parse(stored);
    } else {
        obras = [
            {
                id: 1,
                titulo: 'Abaporu',
                artista: 'Tarsila do Amaral',
                descricao: 'Obra icônica do modernismo brasileiro, representa a brasilidade',
                imagem: 'https://coleccion.malba.org.ar/wp-content/uploads/2019/05/Do-Amaral-Abaporu-067-1.jpg',
                favorito: false
            },
            {
                id: 2,
                titulo: 'Mona Lisa',
                artista: 'Leonardo da Vinci',
                descricao: 'A pintura mais famosa do mundo, conhecida por seu sorriso enigmático',
                imagem: 'https://images.unsplash.com/photo-1578926314433-e2789279f4aa?w=800',
                favorito: false
            },
            {
                id: 3,
                titulo: 'A Noite Estrelada',
                artista: 'Vincent van Gogh',
                descricao: 'Obra-prima do pós-impressionismo com céu turbilhonante',
                imagem: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800',
                favorito: false
            },
            {
                id: 4,
                titulo: 'O Grito',
                artista: 'Edvard Munch',
                descricao: 'Expressão icônica de angústia e desespero existencial',
                imagem: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800',
                favorito: false
            }
        ];
        saveObras();
    }
}

function saveObras() {
    localStorage.setItem('obras', JSON.stringify(obras));
}

function updateCounts() {
    document.getElementById('todasCount').textContent = obras.length;
    document.getElementById('favoritosCount').textContent = obras.filter(o => o.favorito).length;
}

// ==========================================
// CARROSSEL
// ==========================================
function renderCarousel() {
    const track = document.getElementById('carouselTrack');
    
    if (obras.length === 0) {
        track.innerHTML = `
            <div class="carousel-slide">
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: rgba(255,255,255,0.05);">
                    <p style="color: #9aa4b2; font-size: 1.2rem;">Nenhuma obra adicionada ainda</p>
                </div>
            </div>
        `;
        return;
    }
    
    track.innerHTML = obras.map(obra => `
        <div class="carousel-slide">
            <img src="${obra.imagem}" alt="${obra.titulo}" onerror="this.src='https://via.placeholder.com/800x500/1a1a1a/666666?text=Imagem+nao+encontrada'">
            <div class="carousel-caption">
                <h3>${obra.titulo}</h3>
                <p>${obra.artista}</p>
            </div>
        </div>
    `).join('');
    
    updateCarousel();
}

function updateCarousel() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    
    const offset = currentSlide * 100;
    track.style.transform = `translateX(-${offset}%)`;
}

function nextSlide() {
    if (obras.length === 0) return;
    currentSlide = (currentSlide + 1) % obras.length;
    updateCarousel();
}

function prevSlide() {
    if (obras.length === 0) return;
    currentSlide = (currentSlide - 1 + obras.length) % obras.length;
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

// ==========================================
// NAVEGAR PARA DETALHES
// ==========================================
function goToDetails(id) {
    localStorage.setItem('selectedObraId', id);
    window.location.href = 'detalhes.html';
}

// ==========================================
// RENDERIZAÇÃO DE OBRAS
// ==========================================
function renderObras() {
    const grid = document.getElementById('obrasGrid');
    
    if (obras.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                <h3>Nenhuma obra cadastrada</h3>
                <p>Clique em "Adicionar Obra" para começar</p>
            </div>
        `;
    } else {
        grid.innerHTML = obras.map(obra => `
            <div class="obra-card">
                <img src="${obra.imagem}" alt="${obra.titulo}" onerror="this.src='https://via.placeholder.com/300x250/1a1a1a/666666?text=Imagem+nao+encontrada'">
                <div class="obra-info">
                    <h3>${obra.titulo}</h3>
                    <p><strong>${obra.artista}</strong></p>
                    <p>${obra.descricao}</p>
                    <div class="obra-actions">
                        <button class="btn-icon btn-details" onclick="goToDetails(${obra.id})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                            Ver Detalhes
                        </button>
                        <button class="btn-icon btn-favorite ${obra.favorito ? 'active' : ''}" 
                                onclick="event.stopPropagation(); toggleFavorite(${obra.id})">
                            <svg viewBox="0 0 24 24" fill="${obra.favorito ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
                            </svg>
                            Favorito
                        </button>
                        ${isDevMode ? `
                            <button class="btn-icon btn-edit" onclick="event.stopPropagation(); editObra(${obra.id})">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                                Editar
                            </button>
                            <button class="btn-icon btn-delete" onclick="event.stopPropagation(); deleteObra(${obra.id})">
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
    const favoritos = obras.filter(o => o.favorito);
    
    if (favoritos.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <h3>Nenhum favorito ainda</h3>
                <p>Adicione obras aos favoritos clicando na estrela ⭐</p>
            </div>
        `;
    } else {
        grid.innerHTML = favoritos.map(obra => `
            <div class="obra-card">
                <img src="${obra.imagem}" alt="${obra.titulo}" onerror="this.src='https://via.placeholder.com/300x250/1a1a1a/666666?text=Imagem+nao+encontrada'">
                <div class="obra-info">
                    <h3>${obra.titulo}</h3>
                    <p><strong>${obra.artista}</strong></p>
                    <p>${obra.descricao}</p>
                    <div class="obra-actions">
                        <button class="btn-icon btn-details" onclick="goToDetails(${obra.id})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                            Ver Detalhes
                        </button>
                        <button class="btn-icon btn-favorite active" 
                                onclick="event.stopPropagation(); toggleFavorite(${obra.id})">
                            <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
                            </svg>
                            Favorito
                        </button>
                        ${isDevMode ? `
                            <button class="btn-icon btn-edit" onclick="event.stopPropagation(); editObra(${obra.id})">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                                Editar
                            </button>
                            <button class="btn-icon btn-delete" onclick="event.stopPropagation(); deleteObra(${obra.id})">
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
}

// ==========================================
// CRUD - CREATE, UPDATE, DELETE
// ==========================================
function openModal(id = null) {
    if (!isDevMode && id !== null) {
        alert('🔒 Faça login como desenvolvedor para editar! (Clique 7x na logo)');
        return;
    }
    
    if (!isDevMode && id === null) {
        alert('🔒 Faça login como desenvolvedor para adicionar obras! (Clique 7x na logo)');
        return;
    }
    
    editingId = id;
    const modal = document.getElementById('modal');
    
    if (id) {
        const obra = obras.find(o => o.id === id);
        document.getElementById('modalTitle').textContent = 'Editar Obra';
        document.getElementById('obraTitulo').value = obra.titulo;
        document.getElementById('obraArtista').value = obra.artista;
        document.getElementById('obraDescricao').value = obra.descricao;
        document.getElementById('obraImagem').value = obra.imagem;
    } else {
        document.getElementById('modalTitle').textContent = 'Adicionar Obra';
        document.getElementById('obraTitulo').value = '';
        document.getElementById('obraArtista').value = '';
        document.getElementById('obraDescricao').value = '';
        document.getElementById('obraImagem').value = '';
    }
    
    modal.classList.add('active');
    document.getElementById('obraTitulo').focus();
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    editingId = null;
}

function saveObra() {
    const obraData = {
        titulo: document.getElementById('obraTitulo').value.trim(),
        artista: document.getElementById('obraArtista').value.trim(),
        descricao: document.getElementById('obraDescricao').value.trim(),
        imagem: document.getElementById('obraImagem').value.trim()
    };

    if (!obraData.titulo || !obraData.artista || !obraData.descricao || !obraData.imagem) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    if (editingId) {
        const index = obras.findIndex(o => o.id === editingId);
        obras[index] = { 
            ...obras[index], 
            ...obraData 
        };
    } else {
        obras.push({
            id: Date.now(),
            ...obraData,
            favorito: false
        });
    }

    saveObras();
    renderCarousel();
    renderObras();
    closeModal();
    
    const msg = editingId ? '✅ Obra atualizada com sucesso!' : '✅ Obra adicionada com sucesso!';
    alert(msg);
}

function editObra(id) {
    openModal(id);
}

function deleteObra(id) {
    if (!isDevMode) {
        alert('🔒 Apenas desenvolvedores podem excluir obras!');
        return;
    }
    
    if (confirm('⚠️ Tem certeza que deseja excluir esta obra?')) {
        obras = obras.filter(o => o.id !== id);
        saveObras();
        
        if (currentSlide >= obras.length && obras.length > 0) {
            currentSlide = obras.length - 1;
        } else if (obras.length === 0) {
            currentSlide = 0;
        }
        
        renderCarousel();
        renderObras();
        alert('🗑️ Obra excluída com sucesso!');
    }
}

// ==========================================
// FAVORITOS
// ==========================================
function toggleFavorite(id) {
    const obra = obras.find(o => o.id === id);
    if (obra) {
        obra.favorito = !obra.favorito;
        saveObras();
        renderObras();
    }
}

// ==========================================
// NAVEGAÇÃO POR TABS
// ==========================================
function showTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    if (tab === 'all') {
        document.querySelectorAll('.tab')[0].classList.add('active');
        document.getElementById('allTab').classList.add('active');
    } else if (tab === 'favorites') {
        document.querySelectorAll('.tab')[1].classList.add('active');
        document.getElementById('favoritesTab').classList.add('active');
    }
}

// ==========================================
// LOGOUT
// ==========================================
function logout() {
    if (confirm('⚠️ Deseja sair da sua conta?')) {
        isDevMode = false;
        document.getElementById('userName').textContent = 'Visitante';
        document.getElementById('devBadge').classList.remove('active');
        document.getElementById('devStatus').classList.remove('active');
        
        if (rainbowMode) {
            rainbowMode = false;
            document.getElementById('header').classList.remove('rainbow-mode');
        }
        
        renderObras();
        alert('👋 Logout realizado com sucesso!');
    }
}

// ==========================================
// INICIAR APLICAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', init);

// ==========================================
// EXTRAS: CONSOLE EASTER EGG
// ==========================================
console.log('%c🎨 Galeria de Artes Famosas', 'font-size: 24px; color: #00c6ff; font-weight: bold;');
console.log('%c🎮 Easter Eggs disponíveis:', 'font-size: 14px; color: #9aa4b2;');
console.log('%c1. Konami Code: ↑↑↓↓←→←→BA', 'color: #22c55e;');
console.log('%c2. Clique 7x na logo para login dev', 'color: #22c55e;');
console.log('%c3. Senhas: "tarsila2024" ou "modernismo"', 'color: #22c55e;');
console.log('%c💡 Boa sorte encontrando todos!', 'font-size: 12px; color: #666;');