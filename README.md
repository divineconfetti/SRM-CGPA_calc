# 🎓 Dual-Format Semester GPA Calculator

A comprehensive tool to calculate your semester GPA (Grade Point Average) or CGPA. To showcase different development skills, this repository contains **two complete versions** of the calculator: a modern, interactive Web Application and a lightweight Python Command-Line Interface (CLI).

## 🌟 Live Web Demo
**[👉 Click here to use the Web Application Live!](https://divineconfetti.github.io/SRM-CGPA_calc/)**

---

## 💻 Version 1: The Web Application
A fully responsive, client-side web application running entirely in the browser. No backend required!

### ✨ Web Features
* **Interactive UI:** Clean, modern design with smooth CSS animations.
* **Theme Toggling:** Full Dark/Light mode support based on user preference.
* **Visual Analytics:** Integrates `Chart.js` to provide a dynamic doughnut chart of your grade distribution.
* **Export Options:** Users can download their final scorecard as a PDF or export the raw data to a CSV file.

### 🚀 How to Use (Web)
1. Visit the live demo link above.
2. Enter the number of subjects you took this semester.
3. Input your subject names, credits, and marks.
4. Click **Calculate GPA** to instantly generate your scorecard, charts, and performance metrics!

---

## 🐍 Version 2: The Python CLI
A lightweight, interactive command-line tool built in Python for developers who prefer the terminal. 

### ✨ Python Features
* **Dynamic Inputs:** Choose exactly how many subjects you want to calculate for the current semester.
* **Standardized Grading:** Automatically converts raw marks (0-100) into standard letter grades and their corresponding grade points.
* **Clean Tabular Output:** Utilizes the `pandas` library to print a beautifully formatted scorecard directly in your terminal.

### 🚀 How to Run (Python)
1. Ensure you have Python 3 and Pandas installed (`pip install pandas`).
2. Clone this repository and navigate to the folder.
3. Run the script in your terminal:
   ```bash
   python cgpa_calculator.py
