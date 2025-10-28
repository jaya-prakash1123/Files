## Hi there 👋
<!--
**jaya-prakash1123/jaya-prakash1123** is a ✨ _special_ ✨ repository because its `README.md` (this file) appears on your GitHub profile.
Here are some ideas to get you started:
- 🔭 I’m currently working on ...
- 🌱 I’m currently learning ...
- 👯 I’m looking to collaborate on ...
- 🤔 I’m looking for help with ...
- 💬 Ask me about ...
- 📫 How to reach me: ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...
# Study Materials Library
A clean and simple static website for browsing, viewing, and downloading educational PDF materials. Built with vanilla HTML, CSS, and JavaScript - no frameworks or build tools required.
## Features
- **Organized Categories** - PDFs organized by subject (Mathematics, Science, English, History, etc.)
- **Collapsible Sections** - Click category headers to expand/collapse content
- **Real-time Search** - Search PDFs by title, category, or description as you type
- **PDF Viewer** - View PDFs in a modal overlay without leaving the page
- **Direct Downloads** - One-click download to save PDFs locally
- **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- **Accessible** - Keyboard navigation and screen reader friendly
## Demo
Visit the live site: [Your GitHub Pages URL will be here after deployment]
## Quick Start
### 1. Clone or Download
```bash
git clone https://github.com/jaya-prakash1123/jaya-prakash1123.git
cd jaya-prakash1123
```
### 2. Add Your PDF Files
Place your PDF files in the appropriate subject folders:
```
pdfs/
├── mathematics/
├── science/
├── english/
├── history/
└── [add more subjects as needed]/
```
### 3. Update the PDF Data
Edit `js/data.js` and add entries for your PDFs:
```javascript
{
    id: 18,
    title: "Your PDF Title",
    category: "Mathematics",
    filename: "your-file.pdf",
    path: "pdfs/mathematics/your-file.pdf",
    description: "Brief description of the content"
}
```
### 4. Open in Browser
Simply open `index.html` in your web browser, or use a local server:
```bash
# Using Python 3
python -m http.server 8000
# Using Node.js
npx http-server
# Using PHP
php -S localhost:8000
```
Then visit `http://localhost:8000`
## Project Structure
```
jaya-prakash1123/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # All styling (responsive design included)
├── js/
│   ├── data.js            # PDF data array (edit this to add/remove PDFs)
│   └── main.js            # All JavaScript functionality
├── pdfs/
│   ├── mathematics/       # Math PDFs
│   ├── science/           # Science PDFs
│   ├── english/           # English PDFs
│   ├── history/           # History PDFs
│   └── [other subjects]/  # Add more categories as needed
└── README.md              # This file
```
## How to Add PDFs
### Step 1: Upload PDF File
Add your PDF to the appropriate subject folder in `pdfs/`:
```bash
# Example: Adding a new physics PDF
cp path/to/quantum-mechanics.pdf pdfs/science/
```
### Step 2: Update Data Array
Open `js/data.js` and add a new entry:
```javascript
{
    id: 18,  // Use next available number
    title: "Quantum Mechanics - Introduction",
    category: "Science",  // Must match folder name (case-sensitive)
    filename: "quantum-mechanics.pdf",
    path: "pdfs/science/quantum-mechanics.pdf",
    description: "Introduction to quantum theory and wave mechanics"
}
```
### Step 3: Refresh Page
The new PDF will automatically appear in the correct category.
## How to Add New Categories
### Step 1: Create Folder
```bash
mkdir pdfs/computer-science
```
### Step 2: Add PDFs to Data
When you add PDFs with a new category name, the category will automatically appear:
```javascript
{
    id: 19,
    title: "Data Structures and Algorithms",
    category: "Computer Science",  // New category
    filename: "data-structures.pdf",
    path: "pdfs/computer-science/data-structures.pdf",
    description: "Comprehensive guide to DSA concepts"
}
```
Categories are generated automatically from the PDF data and sorted alphabetically.
## Deployment
### GitHub Pages (Recommended)
1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select source: `main` branch, `/` (root) folder
4. Click Save
5. Your site will be live at: `https://[username].github.io/[repository-name]/`
### Netlify
1. Sign up at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Build settings:
   - Build command: (leave empty)
   - Publish directory: `/` or `.`
4. Deploy
### Vercel
1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy (no configuration needed)
## Customization
### Change Colors
Edit the CSS variables in `css/styles.css`:
```css
:root {
    --primary-color: #1e3a8a;  /* Navy blue - change to your color */
    --primary-hover: #1e40af;
    /* ... other colors */
}
```
### Change Site Title
Edit `index.html`:
```html
<h1>Study Materials Library</h1>  <!-- Change this -->
<p class="tagline">Access educational resources</p>  <!-- And this -->
```
### Change Fonts
Edit the Google Fonts link in `index.html` or use system fonts by updating `css/styles.css`:
```css
body {
    font-family: 'Your-Font', sans-serif;
}
```
## Browser Compatibility
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
**Note:** PDF viewing relies on the browser's built-in PDF viewer. All modern browsers support this.
## Features in Detail
### Search Functionality
- **Real-time filtering** as you type
- **Case-insensitive** matching
- Searches through:
  - PDF titles
  - Category names
  - Descriptions
- Clear button to reset search
### Category Management
- All categories start **collapsed** for cleaner view
- Click header to **expand/collapse**
- **Multiple categories** can be open simultaneously
- Visual arrow indicator shows state
### PDF Viewer Modal
- Opens PDF in **overlay modal**
- Click **X button** or click **outside modal** to close
- Press **Escape key** to close
- Prevents background scrolling when open
### Responsive Design
- **Desktop**: Multi-column layouts, optimal spacing
- **Tablet**: Adjusted layouts for medium screens
- **Mobile**: Single-column, touch-friendly buttons (min 44px)
- Modal scales appropriately on all screen sizes
## Important Notes
### File Size Considerations
- GitHub has a **100MB per file** limit
- Keep total repository size **under 1GB** for best performance
- Consider compressing large PDFs
### CORS and Local Testing
- PDFs load fine when:
  - Served via web server (http://localhost:8000)
  - Deployed to hosting (GitHub Pages, Netlify, etc.)
- Some browsers block PDFs when opening `index.html` directly as a file (`file://`)
- **Solution**: Use a local web server for testing (see Quick Start)
## Troubleshooting
### PDFs Not Loading
1. Check that PDF path in `data.js` is correct
2. Ensure PDF file exists in the specified folder
3. Use a web server (not `file://` protocol)
4. Check browser console for errors (F12)
### Categories Not Showing
1. Verify `pdfData` array is valid JavaScript
2. Check that category names are consistent (case-sensitive)
3. Check browser console for errors
### Search Not Working
1. Ensure `js/data.js` is loaded before `js/main.js`
2. Check that search input has correct `id="searchInput"`
3. Open browser console to see any JavaScript errors
### Styling Issues
1. Verify `css/styles.css` is linked in `index.html`
2. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
3. Check for CSS syntax errors
## Performance Tips
- Compress PDF files before uploading
- Limit descriptions to 1-2 sentences
- Consider pagination if you have 100+ PDFs
- Optimize images if you add any to the site
## Contributing
Feel free to fork this project and customize it for your needs. If you add useful features, consider sharing them back!
## License
This project is open source and available for anyone to use and modify.
## Credits
Built with vanilla HTML, CSS, and JavaScript. No frameworks or dependencies required.
---
**Need Help?** Open an issue on GitHub
