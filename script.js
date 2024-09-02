document.addEventListener('DOMContentLoaded', () => {
    const addSubjectBtn = document.getElementById('add-subject-btn');
    const subjectInput = document.getElementById('subject-input');
    const subjectsContainer = document.getElementById('subjects-container');
    const saveButton = document.getElementById('save-button');
    const loadButton = document.getElementById('load-button');
    const fileInput = document.getElementById('file-input');

    // Carregar dados salvos do localStorage
    carregarDados();

    // Adicionar nova matéria
    addSubjectBtn.addEventListener('click', () => {
        const subjectName = subjectInput.value.trim();
        if (subjectName) {
            addSubject(subjectName);
            subjectInput.value = '';
            salvarDados();
        }
    });

    // Função para criar e adicionar uma nova matéria ao DOM
    function addSubject(name, contents = []) {
        const subjectDiv = document.createElement('div');
        subjectDiv.className = 'subject';
        subjectDiv.innerHTML = `
            <h2>${name}</h2>
            <input type="text" placeholder="Adicionar conteúdo" class="content-input">
            <button class="add-content-btn">Adicionar Conteúdo</button>
            <ul class="content-list"></ul>
        `;
        subjectsContainer.appendChild(subjectDiv);

        const contentList = subjectDiv.querySelector('.content-list');
        contents.forEach(content => addContent(contentList, content.text, content.checked));

        // Adicionar funcionalidade aos botões de adicionar conteúdo
        const addContentBtn = subjectDiv.querySelector('.add-content-btn');
        const contentInput = subjectDiv.querySelector('.content-input');

        addContentBtn.addEventListener('click', () => {
            const contentName = contentInput.value.trim();
            if (contentName) {
                addContent(contentList, contentName);
                contentInput.value = '';
                salvarDados();
            }
        });
    }

    // Função para adicionar um novo conteúdo à lista de conteúdos
    function addContent(contentList, name, checked = false) {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" ${checked ? 'checked' : ''}>
            <span>${name}</span>
        `;
        contentList.appendChild(li);

        // Atualizar dados ao marcar/desmarcar conteúdo
        li.querySelector('input[type="checkbox"]').addEventListener('change', salvarDados);
    }

    // Função para salvar os dados no localStorage
    function salvarDados() {
        const subjects = [];
        subjectsContainer.querySelectorAll('.subject').forEach(subjectDiv => {
            const name = subjectDiv.querySelector('h2').textContent;
            const contents = [];
            subjectDiv.querySelectorAll('.content-list li').forEach(li => {
                contents.push({
                    text: li.querySelector('span').textContent,
                    checked: li.querySelector('input[type="checkbox"]').checked
                });
            });
            subjects.push({ name, contents });
        });
        localStorage.setItem('subjects', JSON.stringify(subjects));
    }

    // Função para carregar os dados do localStorage
    function carregarDados() {
        const subjects = JSON.parse(localStorage.getItem('subjects'));
        if (subjects) {
            subjects.forEach(subject => addSubject(subject.name, subject.contents));
        }
    }

    // Função para salvar como arquivo JSON
    saveButton.addEventListener('click', () => {
        const subjects = localStorage.getItem('subjects');
        const blob = new Blob([subjects], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'materias.json';
        a.click();
    });

    // Função para carregar dados de um arquivo JSON
    loadButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = JSON.parse(e.target.result);
                subjectsContainer.innerHTML = ''; // Limpa a lista atual
                data.forEach(subject => addSubject(subject.name, subject.contents));
                salvarDados(); // Salva no localStorage após carregar
            };
            reader.readAsText(file);
        }
    });
});
