interface Problem {
    id: number;
    title: string;
    rank: number;
}

interface CompanyData {
    [company: string]: Problem[];
}

let currentCompany = "Amazon"; // Default company
let companyProblems: CompanyData = {};

// Function to get difficulty based on problem ID
function getDifficulty(id: number): string {
    // Common LeetCode pattern: 1-500 are mostly easy/medium, 500+ are mostly medium/hard
    if (id <= 200) return "Easy";
    if (id <= 500) return "Medium";
    return "Hard";
}

// Function to get acceptance rate (mock data since we don't have real data)
function getAcceptanceRate(id: number): number {
    return 35 + Math.floor(Math.random() * 30); // Returns between 35-65%
}

// Function to select a company
function selectCompany(company: string) {
    if (companyProblems[company]) {
        currentCompany = company;
        localStorage.setItem('selectedCompany', company);
        updateTitle(company);
        displayProblems(company);
        updateActiveButton(company);
    }
}

// Update active button state
function updateActiveButton(company: string) {
    const buttons = document.querySelectorAll('.company-nav button');
    buttons.forEach(button => {
        button.classList.toggle('active', button.getAttribute('data-company') === company);
    });
}

// Fetch the company problems data
async function fetchCompanyData() {
    try {
        const response = await fetch('../assets/data/problems_by_company.json');
        if (!response.ok) {
            throw new Error('Failed to fetch company data');
        }
        companyProblems = await response.json();
        initializePage();
    } catch (error) {
        console.error('Error loading company data:', error);
        document.getElementById('title')!.textContent = 'Error loading data';
    }
}

function initializePage() {
    const storedCompany = localStorage.getItem('selectedCompany');
    if (storedCompany && companyProblems[storedCompany]) {
        currentCompany = storedCompany;
    }
    updateTitle(currentCompany);
    populateCompanyList();
    displayProblems(currentCompany);
    updateActiveButton(currentCompany);
}

function updateTitle(company: string) {
    const titleElement = document.getElementById('title');
    if (titleElement) {
        titleElement.textContent = `${company} Interview Problems`;
    }
}

function populateCompanyList() {
    const datalist = document.getElementById('companyList') as HTMLDataListElement;
    if (!datalist) return;

    datalist.innerHTML = '';
    Object.keys(companyProblems)
        .sort()
        .forEach(company => {
            const option = document.createElement('option');
            option.value = company;
            datalist.appendChild(option);
        });
}

function displayProblems(company: string) {
    const problems = companyProblems[company] || [];
    const table = document.getElementById('solutionTable') as HTMLTableElement;
    if (!table) return;

    const tbody = table.querySelector('tbody') || table.createTBody();
    tbody.innerHTML = '';

    problems.forEach(problem => {
        const difficulty = getDifficulty(problem.id);
        const acceptance = getAcceptanceRate(problem.id);
        const url = `https://leetcode.com/problems/${problem.title.toLowerCase().replace(/\s+/g, '-')}/`;
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${problem.id}</td>
            <td class="difficulty-${difficulty.toLowerCase()}">${difficulty}</td>
            <td><a href="${url}" target="_blank" class="problem-link">${problem.title}</a></td>
            <td data-acceptance="${acceptance}">${acceptance}%</td>
            <td>${problem.rank}</td>
        `;
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchCompanyData();

    const searchInput = document.getElementById('companySearch') as HTMLInputElement;
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const value = (e.target as HTMLInputElement).value;
            if (companyProblems[value]) {
                selectCompany(value);
            }
        });
    }

    // Add sorting functionality
    const headers = document.querySelectorAll('.header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.id;
            sortTable(column);
        });
    });
});

let sortDirection = 1;
let lastSortedColumn = '';

function sortTable(column: string) {
    const tbody = document.querySelector('#solutionTable tbody');
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    if (lastSortedColumn === column) {
        sortDirection *= -1;
    } else {
        sortDirection = 1;
    }
    lastSortedColumn = column;

    rows.sort((a, b) => {
        let aValue = a.cells[getColumnIndex(column)].textContent || '';
        let bValue = b.cells[getColumnIndex(column)].textContent || '';

        if (column === '#' || column === 'Rank') {
            return (parseInt(aValue) - parseInt(bValue)) * sortDirection;
        } else if (column === 'Acceptance') {
            return (parseFloat(aValue) - parseFloat(bValue)) * sortDirection;
        }
        return aValue.localeCompare(bValue) * sortDirection;
    });

    rows.forEach(row => tbody.appendChild(row));
}

function getColumnIndex(columnName: string): number {
    switch (columnName) {
        case '#': return 0;
        case 'Difficulty': return 1;
        case 'Title': return 2;
        case 'Acceptance': return 3;
        case 'Rank': return 4;
        default: return 0;
    }
}
