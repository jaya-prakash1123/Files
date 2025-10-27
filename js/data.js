/**
 * PDF Data Array
 *
 * This array contains all PDF information for the study materials library.
 * Each PDF object should have the following properties:
 *
 * - id: Unique identifier (number)
 * - title: Display name of the PDF (string)
 * - category: Subject category (string) - must match category names exactly
 * - filename: PDF filename with extension (string)
 * - path: Relative path to the PDF file (string)
 * - description: Brief description of the content (string, optional)
 *
 * To add a new PDF:
 * 1. Upload the PDF file to the appropriate pdfs/[category]/ folder
 * 2. Add a new object to the pdfData array below with all required properties
 * 3. Make sure the category name matches existing categories or create a new one
 * 4. Ensure the path correctly points to the PDF file location
 */
const pdfData = [
    // Mathematics
    {
        id: 1,
        title: "Calculus - Chapter 1: Limits and Continuity",
        category: "Mathematics",
        filename: "calculus-limits.pdf",
        path: "pdfs/mathematics/calculus-limits.pdf",
        description: "Introduction to limits, continuity, and foundational calculus concepts"
    },
    {
        id: 2,
        title: "Linear Algebra - Matrix Operations",
        category: "Mathematics",
        filename: "linear-algebra-matrices.pdf",
        path: "pdfs/mathematics/linear-algebra-matrices.pdf",
        description: "Matrix operations, determinants, and linear transformations"
    },
    {
        id: 3,
        title: "Trigonometry Fundamentals",
        category: "Mathematics",
        filename: "trigonometry-basics.pdf",
        path: "pdfs/mathematics/trigonometry-basics.pdf",
        description: "Trigonometric functions, identities, and applications"
    },
    {
        id: 4,
        title: "Probability and Statistics - Basic Concepts",
        category: "Mathematics",
        filename: "probability-stats.pdf",
        path: "pdfs/mathematics/probability-stats.pdf",
        description: "Introduction to probability theory and statistical analysis"
    },
    // Science
    {
        id: 5,
        title: "Physics - Newton's Laws of Motion",
        category: "Physics",
        filename: "newtons-laws.pdf",
        path: "pdfs/science/newtons-laws.pdf",
        description: "Comprehensive guide to Newton's three laws and their applications"
    },
    {
        id: 6,
        title: "Chemistry - Periodic Table and Elements",
        category: "Chemistry",
        filename: "periodic-table.pdf",
        path: "pdfs/science/periodic-table.pdf",
        description: "Understanding the periodic table, element properties, and chemical families"
    },
    {
        id: 7,
        title: "Biology - Cell Structure and Function",
        category: "Biology",
        filename: "cell-biology.pdf",
        path: "pdfs/science/cell-biology.pdf",
        description: "Detailed overview of cellular components and their functions"
    },
    {
        id: 8,
        title: "Physics - Electricity and Magnetism",
        category: "Physics",
        filename: "electricity-magnetism.pdf",
        path: "pdfs/science/electricity-magnetism.pdf",
        description: "Principles of electric circuits, magnetic fields, and electromagnetic induction"
    },
    {
        id: 9,
        title: "Chemistry - Chemical Reactions and Equations",
        category: "Chemistry",
        filename: "chemical-reactions.pdf",
        path: "pdfs/science/chemical-reactions.pdf",
        description: "Types of chemical reactions, balancing equations, and stoichiometry"
    },
    {
        id: 10,
        title: "pygame",
        category: "Biology",
        filename: "pygame.pdf",
        path: "pdfs/Biology/pygame.pdf",
        description: "Detailed overview of cellular components and their functions"
    }
];