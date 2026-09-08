const FEATURED = ['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple'];
const DIFFICULTY = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };

let companies = {};
let difficulties = {};
let rows = [];
let sortKey = 'frequency';
let sortAsc = false;

function slugFor(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function currentCompany() {
    const requested = new URLSearchParams(location.search).get('company');
    if (requested && companies[requested]) return requested;
    const match = requested && Object.keys(companies).find((c) => c.toLowerCase() === requested.toLowerCase());
    return match || 'Amazon';
}

function render() {
    const body = document.querySelector('#table tbody');
    body.textContent = '';
    const sorted = [...rows].sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        const cmp = typeof av === 'string' ? av.localeCompare(bv) : Number(av) - Number(bv);
        return sortAsc ? cmp : -cmp;
    });
    sorted.forEach((row) => {
        const tr = document.createElement('tr');
        const id = document.createElement('td');
        id.textContent = row.id || '';
        const diff = document.createElement('td');
        diff.textContent = DIFFICULTY[row.difficulty] || '';
        if (row.difficulty) diff.className = `diff-${row.difficulty}`;
        const title = document.createElement('td');
        const link = document.createElement('a');
        link.href = `https://leetcode.com/problems/${slugFor(row.title)}/`;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = row.title;
        title.appendChild(link);
        const freq = document.createElement('td');
        const bar = document.createElement('span');
        bar.className = 'freq';
        const meter = document.createElement('i');
        meter.style.setProperty('--w', `${row.frequency}%`);
        bar.append(meter, document.createTextNode(Math.round(row.frequency)));
        freq.appendChild(bar);
        const recent = document.createElement('td');
        if (row.recent) {
            const mark = document.createElement('span');
            mark.className = 'recent';
            mark.textContent = 'Yes';
            recent.appendChild(mark);
        }
        tr.append(id, diff, title, freq, recent);
        body.appendChild(tr);
    });
}

function load(company) {
    rows = (companies[company] || []).map((p) => ({
        id: p.id,
        title: p.title,
        difficulty: difficulties[p.id] || 0,
        frequency: p.frequency || 0,
        recent: !!p.recent,
    }));
    document.getElementById('title').textContent = `${company}: most-asked problems`;
    document.title = `${company} LeetCode problems · Leetcode Explained`;
    render();
}

function go(company) {
    history.pushState({}, '', `?company=${encodeURIComponent(company)}`);
    load(company);
}

async function main() {
    const [companyData, difficultyData] = await Promise.all([
        fetch('/assets/data/problems_by_company.json').then((r) => r.json()),
        fetch('/assets/data/difficulty.json').then((r) => r.json()),
    ]);
    companies = companyData;
    difficulties = difficultyData;

    const names = Object.keys(companies).sort();
    const list = document.getElementById('company-list');
    names.forEach((name) => {
        const option = document.createElement('option');
        option.value = name;
        list.appendChild(option);
    });
    document.getElementById('search').placeholder = `Search ${names.length} companies`;

    const featured = document.getElementById('featured');
    FEATURED.filter((c) => companies[c]).forEach((name) => {
        const link = document.createElement('a');
        link.href = `?company=${encodeURIComponent(name)}`;
        link.onclick = (event) => { event.preventDefault(); go(name); };
        const logo = document.createElement('img');
        logo.src = `https://www.google.com/s2/favicons?domain=${name.toLowerCase()}.com&sz=32`;
        logo.alt = '';
        logo.onerror = () => logo.remove();
        link.append(logo, name);
        featured.appendChild(link);
    });

    const search = document.getElementById('search');
    const pick = () => {
        const match = names.find((c) => c.toLowerCase() === search.value.trim().toLowerCase());
        if (match) go(match);
    };
    search.addEventListener('change', pick);
    search.addEventListener('keydown', (event) => { if (event.key === 'Enter') pick(); });

    document.querySelectorAll('th[data-sort]').forEach((th) => {
        th.onclick = () => {
            const key = th.dataset.sort;
            sortAsc = sortKey === key ? !sortAsc : key === 'title';
            sortKey = key;
            render();
        };
    });

    window.addEventListener('popstate', () => load(currentCompany()));
    load(currentCompany());
}

main();
