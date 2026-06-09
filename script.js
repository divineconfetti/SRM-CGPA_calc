document.addEventListener('DOMContentLoaded', () => {
    // Theme toggling
    const themeToggle = document.getElementById('themeToggle');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        updateChartTheme();
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }
    }

    // Generate Rows
    const generateBtn = document.getElementById('generateBtn');
    const numSubjectsInput = document.getElementById('numSubjects');
    const setupError = document.getElementById('setupError');
    const subjectsSection = document.getElementById('subjectsSection');
    const subjectsContainer = document.getElementById('subjectsContainer');
    const setupSection = document.getElementById('setupSection');

    generateBtn.addEventListener('click', () => {
        const num = parseInt(numSubjectsInput.value);
        if (isNaN(num) || num < 1 || num > 15) {
            setupError.textContent = 'Please enter a valid number of subjects (1-15).';
            return;
        }
        setupError.textContent = '';
        generateSubjectRows(num);
        setupSection.style.display = 'none';
        subjectsSection.classList.remove('hidden');
        subjectsSection.style.animation = 'fadeIn 0.5s ease';
    });

    function generateSubjectRows(num) {
        subjectsContainer.innerHTML = '';
        // Add headers for desktop layout
        const headerRow = document.createElement('div');
        headerRow.className = 'subject-row header-row desktop-only';
        headerRow.innerHTML = `
            <div>Subject Name</div>
            <div>Credits</div>
            <div>Marks (0-100)</div>
        `;
        subjectsContainer.appendChild(headerRow);

        for (let i = 1; i <= num; i++) {
            const row = document.createElement('div');
            row.className = 'subject-row';
            row.innerHTML = `
                <div class="form-control">
                    <label class="mobile-only">Subject Name</label>
                    <input type="text" class="subj-name" placeholder="Subject ${i}" required>
                </div>
                <div class="form-control">
                    <label class="mobile-only">Credits</label>
                    <input type="number" class="subj-credit" min="1" max="10" placeholder="Credits" required>
                </div>
                <div class="form-control">
                    <label class="mobile-only">Marks</label>
                    <input type="number" class="subj-mark" min="0" max="100" placeholder="Marks" required>
                </div>
            `;
            subjectsContainer.appendChild(row);
        }
    }

    // Calculate Logic
    const subjectsForm = document.getElementById('subjectsForm');
    const formError = document.getElementById('formError');
    const resultsSection = document.getElementById('resultsSection');
    let gradeChartInstance = null;

    function getGradeInfo(marks) {
        if (marks >= 91) return { grade: 'O', points: 10 };
        if (marks >= 81) return { grade: 'A+', points: 9 };
        if (marks >= 71) return { grade: 'A', points: 8 };
        if (marks >= 61) return { grade: 'B+', points: 7 };
        if (marks >= 56) return { grade: 'B', points: 6 };
        if (marks >= 50) return { grade: 'C', points: 5 };
        return { grade: 'F', points: 0 };
    }

    function getPerformanceMessage(gpa) {
        if (gpa >= 9.0) return "Outstanding";
        if (gpa >= 8.0) return "Excellent";
        if (gpa >= 7.0) return "Very Good";
        if (gpa >= 6.0) return "Good";
        return "Needs Improvement";
    }

    subjectsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const names = document.querySelectorAll('.subj-name');
        const credits = document.querySelectorAll('.subj-credit');
        const marks = document.querySelectorAll('.subj-mark');
        
        let totalCredits = 0;
        let totalPoints = 0;
        let resultsData = [];
        let gradeCounts = { 'O': 0, 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'F': 0 };
        
        let isValid = true;
        formError.textContent = '';

        for (let i = 0; i < names.length; i++) {
            const name = names[i].value.trim() || `Subject ${i + 1}`;
            const credit = parseFloat(credits[i].value);
            const mark = parseFloat(marks[i].value);

            if (isNaN(credit) || credit <= 0) {
                isValid = false;
                formError.textContent = 'Credits must be greater than 0.';
                break;
            }
            if (isNaN(mark) || mark < 0 || mark > 100) {
                isValid = false;
                formError.textContent = 'Marks must be between 0 and 100.';
                break;
            }

            const { grade, points } = getGradeInfo(mark);
            totalCredits += credit;
            totalPoints += (credit * points);
            gradeCounts[grade]++;

            resultsData.push({
                name, credit, mark, grade, points
            });
        }

        if (!isValid) return;

        const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
        
        displayResults(resultsData, totalCredits, totalPoints, gpa, gradeCounts);
    });

    function displayResults(data, totalCredits, totalPoints, gpa, gradeCounts) {
        const tbody = document.getElementById('resultTableBody');
        tbody.innerHTML = '';
        
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${item.credit}</td>
                <td>${item.mark}</td>
                <td><span class="badge grade-${item.grade.replace('+','plus')}">${item.grade}</span></td>
                <td>${item.points}</td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById('totalCredits').textContent = totalCredits;
        document.getElementById('totalPoints').textContent = totalPoints;
        
        const gpaEl = document.getElementById('finalGpa');
        gpaEl.textContent = gpa;
        
        const msgEl = document.getElementById('performanceMsg');
        msgEl.textContent = getPerformanceMessage(parseFloat(gpa));
        
        // Render chart
        renderChart(gradeCounts);

        subjectsSection.style.display = 'none';
        resultsSection.classList.remove('hidden');
        resultsSection.style.animation = 'slideUp 0.6s ease';
        
        // Add animation class
        gpaEl.classList.remove('pop-in');
        void gpaEl.offsetWidth; // trigger reflow
        gpaEl.classList.add('pop-in');
    }

    function renderChart(gradeCounts) {
        const ctx = document.getElementById('gradeChart').getContext('2d');
        if (gradeChartInstance) {
            gradeChartInstance.destroy();
        }

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#e2e8f0' : '#333333';

        const labels = Object.keys(gradeCounts).filter(k => gradeCounts[k] > 0);
        const data = labels.map(k => gradeCounts[k]);

        gradeChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#28a745', // O
                        '#17a2b8', // A+
                        '#007bff', // A
                        '#6f42c1', // B+
                        '#fd7e14', // B
                        '#ffc107', // C
                        '#dc3545'  // F
                    ],
                    borderWidth: isDark ? 2 : 1,
                    borderColor: isDark ? '#16213e' : '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: textColor }
                    },
                    title: {
                        display: true,
                        text: 'Grade Distribution',
                        color: textColor
                    }
                }
            }
        });
    }

    function updateChartTheme() {
        if (gradeChartInstance) {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const textColor = isDark ? '#e2e8f0' : '#333333';
            const borderColor = isDark ? '#16213e' : '#fff';
            
            gradeChartInstance.options.plugins.legend.labels.color = textColor;
            gradeChartInstance.options.plugins.title.color = textColor;
            gradeChartInstance.data.datasets[0].borderColor = borderColor;
            gradeChartInstance.data.datasets[0].borderWidth = isDark ? 2 : 1;
            gradeChartInstance.update();
        }
    }

    // Reset Functionality
    document.getElementById('resetBtn').addEventListener('click', resetApp);
    document.getElementById('newCalculationBtn').addEventListener('click', resetApp);

    function resetApp() {
        subjectsForm.reset();
        subjectsSection.classList.add('hidden');
        resultsSection.classList.add('hidden');
        setupSection.style.display = 'block';
        numSubjectsInput.value = '';
        setupSection.style.animation = 'fadeIn 0.5s ease';
        if(gradeChartInstance) gradeChartInstance.destroy();
    }

    // PDF Export
    document.getElementById('downloadPdfBtn').addEventListener('click', () => {
        const element = document.getElementById('printArea');
        const opt = {
            margin:       0.5,
            filename:     'Semester_GPA_Result.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    });

    // CSV Export
    document.getElementById('exportCsvBtn').addEventListener('click', () => {
        const rows = document.querySelectorAll('#resultTableBody tr');
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Subject,Credit,Marks,Grade,Points\\n";

        rows.forEach(row => {
            const cols = row.querySelectorAll('td');
            const data = Array.from(cols).map(c => c.innerText.trim()).join(",");
            csvContent += data + "\\n";
        });

        const totalCredits = document.getElementById('totalCredits').textContent;
        const totalPoints = document.getElementById('totalPoints').textContent;
        const gpa = document.getElementById('finalGpa').textContent;

        csvContent += `\\nTotal Credits,${totalCredits},,,\\n`;
        csvContent += `Total Points,${totalPoints},,,\\n`;
        csvContent += `Semester GPA,${gpa},,,\\n`;

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Semester_GPA_Result.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
