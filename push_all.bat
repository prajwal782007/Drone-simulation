@echo off
echo Initializing git repository...
git init
git remote remove origin 2>nul
git remote add origin https://github.com/prajwal782007/Drone-simulation.git
git branch -M main

echo Committing 1/16: README.md
git add README.md
git commit -m "docs: add README.md"
git push -u origin main

echo Committing 2/16: .gitignore
git add .gitignore
git commit -m "chore: add .gitignore"
git push origin main

echo Committing 3/16: index.html
git add index.html
git commit -m "feat: add index.html"
git push origin main

echo Committing 4/16: package.json
git add package.json
git commit -m "chore: add package.json"
git push origin main

echo Committing 5/16: vite.config.js
git add vite.config.js
git commit -m "chore: add vite config"
git push origin main

echo Committing 6/16: src\App.css
git add src\App.css
git commit -m "style: add App.css"
git push origin main

echo Committing 7/16: src\App.jsx
git add src\App.jsx
git commit -m "feat: add App.jsx"
git push origin main

echo Committing 8/16: src\index.css
git add src\index.css
git commit -m "style: add index.css"
git push origin main

echo Committing 9/16: src\main.jsx
git add src\main.jsx
git commit -m "feat: add main.jsx"
git push origin main

echo Committing 10/16: src\components\Charts.jsx
git add src\components\Charts.jsx
git commit -m "feat: add Charts component"
git push origin main

echo Committing 11/16: src\components\LogConsole.jsx
git add src\components\LogConsole.jsx
git commit -m "feat: add LogConsole component"
git push origin main

echo Committing 12/16: src\components\NeuralNetworkViz.jsx
git add src\components\NeuralNetworkViz.jsx
git commit -m "feat: add NeuralNetworkViz component"
git push origin main

echo Committing 13/16: src\components\Simulation3D.jsx
git add src\components\Simulation3D.jsx
git commit -m "feat: add Simulation3D component"
git push origin main

echo Committing 14/16: src\components\StatsDashboard.jsx
git add src\components\StatsDashboard.jsx
git commit -m "feat: add StatsDashboard component"
git push origin main

echo Committing 15/16: src\hooks\useSimulationState.js
git add src\hooks\useSimulationState.js
git commit -m "feat: add useSimulationState hook"
git push origin main

echo Committing 16/16: package-lock.json
git add package-lock.json
git commit -m "chore: add package-lock.json"
git push origin main

echo All 16 commits have been pushed successfully!
pause
