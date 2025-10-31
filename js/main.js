/**
 * Study Materials Library - Main JavaScript
 * Handles all interactive functionality including:
 * - Category rendering and expand/collapse
 * - Search and filtering
 * - PDF modal viewer
 * - Event handling and user interactions
 */
// DOM Elements
let categoriesContainer;
let searchResults;
let noResults;
let searchInput;
let clearSearchBtn;
let pdfModal;
let pdfViewer;
let closeModalBtn;
/**
 * Initialize the application on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    categoriesContainer = document.getElementById('categoriesContainer');
    searchResults = document.getElementById('searchResults');
    noResults = document.getElementById('noResults');
    searchInput = document.getElementById('searchInput');
    clearSearchBtn = document.getElementById('clearSearch');
    pdfModal = document.getElementById('pdfModal');
    pdfViewer = document.getElementById('pdfViewer');
    closeModalBtn = document.getElementById('closeModal');
    // Render all categories on page load
    renderCategories();
    // Set up event listeners
    setupEventListeners();
});
/**
 * Render all category sections with their PDFs
 */
function renderCategories() {
    // Get unique categories from pdfData
    const categories = [...new Set(pdfData.map(pdf => pdf.category))];
    // Sort categories alphabetically
    categories.sort();
    // Clear the container
    categoriesContainer.innerHTML = '';
    // Create category sections
    categories.forEach(categoryName => {
        // Filter PDFs for this category
        const categoryPdfs = pdfData.filter(pdf => pdf.category === categoryName);
        // Create category container
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        // Create category header
        const headerDiv = document.createElement('div');
        headerDiv.className = 'category-header';
        headerDiv.setAttribute('role', 'button');
        headerDiv.setAttribute('tabindex', '0');
        headerDiv.setAttribute('aria-expanded', 'false');
        const titleH3 = document.createElement('h3');
        titleH3.className = 'category-title';
        titleH3.textContent = categoryName;
        const arrowSpan = document.createElement('span');
        arrowSpan.className = 'category-arrow';
        arrowSpan.textContent = '▼';
        headerDiv.appendChild(titleH3);
        headerDiv.appendChild(arrowSpan);
        // Create category content (initially hidden)
        const contentDiv = document.createElement('div');
        contentDiv.className = 'category-content';
        // Add PDFs to content
        categoryPdfs.forEach(pdf => {
            const pdfItem = createPdfElement(pdf);
            contentDiv.appendChild(pdfItem);
        });
        // Assemble category
        categoryDiv.appendChild(headerDiv);
        categoryDiv.appendChild(contentDiv);
        categoriesContainer.appendChild(categoryDiv);
        // Add click event for expand/collapse
        headerDiv.addEventListener('click', () => toggleCategory(headerDiv, contentDiv, arrowSpan));
        // Add keyboard support for accessibility
        headerDiv.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCategory(headerDiv, contentDiv, arrowSpan);
            }
        });
    });
}
/**
 * Create a PDF item element
 * @param {Object} pdf - PDF data object
 * @returns {HTMLElement} - PDF item div
 */
function createPdfElement(pdf) {
    const pdfItem = document.createElement('div');
    pdfItem.className = 'pdf-item';
    // PDF info section
    const pdfInfo = document.createElement('div');
    pdfInfo.className = 'pdf-info';
    const titleDiv = document.createElement('div');
    titleDiv.className = 'pdf-title';
    titleDiv.textContent = pdf.title;
    pdfInfo.appendChild(titleDiv);
    // Add description if available
    if (pdf.description && pdf.description.trim() !== '') {
        const descDiv = document.createElement('div');
        descDiv.className = 'pdf-description';
        descDiv.textContent = pdf.description;
        pdfInfo.appendChild(descDiv);
    }
    // Actions section
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'pdf-actions';
    // View button
    const viewBtn = document.createElement('button');
    viewBtn.className = 'btn-view';
    viewBtn.textContent = 'View';
    viewBtn.setAttribute('data-pdf-path', pdf.path);
    viewBtn.addEventListener('click', () => openPdfModal(pdf.path));
    // Download button
    const downloadBtn = document.createElement('a');
    downloadBtn.className = 'btn-download';
    downloadBtn.textContent = 'Download';
    downloadBtn.href = pdf.path;
    downloadBtn.download = pdf.filename;
    actionsDiv.appendChild(viewBtn);
    actionsDiv.appendChild(downloadBtn);
    // Assemble PDF item
    pdfItem.appendChild(pdfInfo);
    pdfItem.appendChild(actionsDiv);
    return pdfItem;
}
/**
 * Toggle category expand/collapse
 * @param {HTMLElement} header - Category header element
 * @param {HTMLElement} content - Category content element
 * @param {HTMLElement} arrow - Arrow indicator element
 */
function toggleCategory(header, content, arrow) {
    const isExpanded = content.classList.contains('expanded');
    if (isExpanded) {
        // Collapse
        content.classList.remove('expanded');
        header.classList.remove('expanded');
        arrow.classList.remove('expanded');
        header.setAttribute('aria-expanded', 'false');
    } else {
        // Expand
        content.classList.add('expanded');
        header.classList.add('expanded');
        arrow.classList.add('expanded');
        header.setAttribute('aria-expanded', 'true');
    }
}
/**
 * Handle search input and filter PDFs
 */
function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    // If search is empty, return to category view
    if (query === '') {
        clearSearchResults();
        return;
    }
    // Filter PDFs based on query
    const results = pdfData.filter(pdf => {
        const titleMatch = pdf.title.toLowerCase().includes(query);
        const categoryMatch = pdf.category.toLowerCase().includes(query);
        const descriptionMatch = pdf.description && pdf.description.toLowerCase().includes(query);
        return titleMatch || categoryMatch || descriptionMatch;
    });
    // Display results
    if (results.length > 0) {
        displaySearchResults(results);
    } else {
        displayNoResults();
    }
}
/**
 * Display search results
 * @param {Array} results - Filtered PDF array
 */
function displaySearchResults(results) {
    // Hide categories and no results
    categoriesContainer.style.display = 'none';
    noResults.style.display = 'none';
    searchResults.style.display = 'block';
    // Clear previous results
    searchResults.innerHTML = '';
    // Add matching PDFs
    results.forEach(pdf => {
        const pdfItem = createPdfElement(pdf);
        searchResults.appendChild(pdfItem);
    });
}
/**
 * Display "no results" message
 */
function displayNoResults() {
    categoriesContainer.style.display = 'none';
    searchResults.style.display = 'none';
    noResults.style.display = 'block';
}
/**
 * Clear search and return to category view
 */
function clearSearchResults() {
    searchInput.value = '';
    searchResults.style.display = 'none';
    noResults.style.display = 'none';
    categoriesContainer.style.display = 'flex';
}
/**
 * Open PDF in modal viewer
 * @param {string} pdfPath - Path to PDF file
 */
function openPdfModal(pdfPath) {
    pdfViewer.src = pdfPath;
    pdfModal.classList.add('active');
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
}
/**
 * Close PDF modal
 */
function closePdfModal() {
    pdfModal.classList.remove('active');
    pdfViewer.src = '';
    // Restore background scrolling
    document.body.style.overflow = '';
}
/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Search input - real-time filtering
    searchInput.addEventListener('input', handleSearch);
    // Clear search button
    clearSearchBtn.addEventListener('click', clearSearchResults);
    // Close modal button
    closeModalBtn.addEventListener('click', closePdfModal);
    // Close modal on backdrop click
    pdfModal.addEventListener('click', (e) => {
        if (e.target === pdfModal) {
            closePdfModal();
        }
    });
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pdfModal.classList.contains('active')) {
            closePdfModal();
        }
    });
}