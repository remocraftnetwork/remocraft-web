const locale = location.pathname.includes('/es/') ? 'es' : 'en';
const jsonPath = getAssetPath(`assets/announcements-${locale}.json`);
const perPage = 10;
let announcements = [];
let currentPage = 0;

const announcementsList = document.getElementById('announcements-list');
const statusMessage = document.getElementById('status');
const pagination = document.getElementById('pagination');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

const getText = (enText, esText) => locale === 'es' ? esText : enText;

const showStatus = (text, isError = false) => {
    statusMessage.textContent = text;
    statusMessage.className = isError ? 'status-message error' : 'status-message';
    statusMessage.style.display = 'block';
};

const hideStatus = () => {
    statusMessage.style.display = 'none';
};

async function loadAnnouncements() {
    try {
        showStatus(getText('Loading announcements...', 'Cargando anuncios...'));
        const res = await fetch(jsonPath, { cache: 'no-cache' });
        if (!res.ok) throw new Error('Network error');
        announcements = await res.json();
        if (!Array.isArray(announcements)) announcements = [];
        currentPage = 0;
        renderPage();
        hideStatus();
        pagination.style.display = announcements.length > perPage ? 'flex' : 'none';
    } catch (e) {
        console.error(e);
        showStatus(getText('Could not load announcements. Try again later.', 'No se pudieron cargar los anuncios. Intenta más tarde.'), true);
    }
}

function renderPage() {
    announcementsList.innerHTML = '';
    const start = currentPage * perPage;
    const pageItems = announcements.slice(start, start + perPage);

    if (pageItems.length === 0) {
        announcementsList.innerHTML = `<div class="announcement-card show"><div class="announcement-meta">${getText('No announcements', 'No hay anuncios')}</div></div>`;
        pagination.style.display = 'none';
        return;
    }

    pageItems.forEach((a, idx) => {
        const card = document.createElement('article');
        card.className = 'announcement-card';

        const title = document.createElement('h2');
        title.textContent = a.title || `${getText('Announcement', 'Anuncio')} #${a.number || (start + idx + 1)}`;

        const content = document.createElement('div');
        content.className = 'announcement-body';
        content.innerHTML = marked.parse(a.body || '');

        const meta = document.createElement('div');
        meta.className = 'announcement-meta';
        const date = a.created_at ? new Date(a.created_at).toLocaleString(locale === 'es' ? 'es-ES' : 'en-US') : '';
        meta.textContent = date;

        card.appendChild(title);
        card.appendChild(content);
        if (date) card.appendChild(meta);
        announcementsList.appendChild(card);

        requestAnimationFrame(() => card.classList.add('show'));
    });

    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = (start + perPage) >= announcements.length;
    if (pageInfo) {
        const totalPages = Math.max(1, Math.ceil(announcements.length / perPage));
        const pageStart = start + 1;
        const pageEnd = Math.min(start + perPage, announcements.length);
        pageInfo.textContent = getText(
            `Page ${currentPage + 1} of ${totalPages} · Showing ${pageStart}-${pageEnd} of ${announcements.length}`,
            `Página ${currentPage + 1} de ${totalPages} · Mostrando ${pageStart}-${pageEnd} de ${announcements.length}`
        );
    }
}

prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        renderPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

nextBtn.addEventListener('click', () => {
    if ((currentPage + 1) * perPage < announcements.length) {
        currentPage++;
        renderPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

loadAnnouncements();
