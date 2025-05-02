document.addEventListener('DOMContentLoaded', () => {
    const ROOM_ID = getRoomId()

    const btn = document.querySelector('.upload-big-btn')
    const modal = document.querySelector('#modal-add-room-file')
    const modalUploadBtn = document.querySelector('#upload-btn')
    const closeModalBtn = document.querySelector('#modal-add-room-file .modal-close')
    const fileInput = document.querySelector('#modal-add-room-file .file-input ')
    const fileNameSpan = document.querySelector('#modal-add-room-file .file-name ')
    const fileNameInput = modal.querySelector('#file-name')
    const fileBlock = document.querySelector('#modal-add-room-file .file')
    const fileLabel = document.querySelector('#modal-add-room-file .file-label .file-label')
    
    const descriptionTextarea = document.querySelector('#description-textarea')
    const counterSpan = document.querySelector('#counter-span')
    const statusMessage = modal.querySelector('#status-message')
    const statusMessageText = statusMessage.querySelector('.message-body')
    const saveBtns = document.querySelectorAll('#save-btn')
    const filesContainer = document.querySelector('#files-container')

    function getRoomId() {
        let currentUrl = window.location.href
        let parts = currentUrl.split("/")
        return parts[parts.length - 2]
    }
    function openModal(e) {
        modal.classList.add('is-active')
        statusMessageText.classList.add('is-hidden')
    }

    function closeModal(e) {
        e.target.parentNode.classList.remove('is-active')
    }

    function proccessTextareaEdits(e) {
        let str = e.target.value
        if (str.length > 200) {
            e.target.value = str.slice(0, 200)
        }   
        counterSpan.textContent = e.target.value.length
    }

    btn.addEventListener('click', openModal)
    closeModalBtn.addEventListener('click', closeModal)

    fileInput.addEventListener('change', () => {
        fileNameSpan.textContent = fileInput.files[0].name
        fileBlock.classList.remove('is-link')
        fileBlock.classList.add('is-primary')
        fileLabel.textContent = 'Успешно'

        modalUploadBtn.attributes.removeNamedItem("disabled")
    })

    modalUploadBtn.addEventListener('click', (e) => {
        if (fileNameInput.value.length === 0) {
            // add logic
            return
        }
        let formData = new FormData()
        formData.append("file", fileInput.files[0])
        formData.append("description", descriptionTextarea.value)
        formData.append("room_id", ROOM_ID)

        let options = {
            method: 'POST',
            body: formData
        }

        fetch("/room/upload", options)
            .then(response => {
                if (!response.ok) {
                    throw Error("REPONSE NOT OK" + response.status)
                }
                return response.json()
            })
            .then(data => {
                if ('id' in data) {
                    addFileToPage(data)
                    statusMessageText.classList.remove('is-hidden')
                    statusMessage.classList.add('is-success')
                    statusMessageText.textContent = "Вы успешно загрузили файл!"
                } else {
                    console.log(data)
                    throw Error()
                }
            })
            .catch(ex => {
                statusMessageText.classList.remove("is-hidden")
                statusMessage.classList.add("is-danger")
                statusMessageText.textContent = 'Не удалось загрузить файл'
            })
    })

    descriptionTextarea.addEventListener('input', proccessTextareaEdits)

    saveBtns.forEach(function (btn) {
        btn.addEventListener('clcik', saveFile)
    })

    function saveFile(e) {
        let fileId = e.target.getAttribute("data")
        console.log(fileId)
    }

    function addFileToPage(fileData) {
        var cardDiv = document.createElement("div");
        cardDiv.classList.add("card");


        var cardContentDiv = document.createElement("div");
        cardContentDiv.classList.add("card-content");


        var mediaDiv = document.createElement("div");
        mediaDiv.classList.add("media");


        var mediaLeftDiv = document.createElement("div");
        mediaLeftDiv.classList.add("media-left");


        var figureElement = document.createElement("figure");
        figureElement.classList.add("image");
        figureElement.classList.add("is-48x48");


        var imgElement = document.createElement("img");
        imgElement.src = "https://bulma.io/assets/images/placeholders/96x96.png";
        imgElement.alt = "txt";


        figureElement.appendChild(imgElement);
        mediaLeftDiv.appendChild(figureElement);


        var mediaContentDiv = document.createElement("div");
        mediaContentDiv.classList.add("media-content");


        var titleElement = document.createElement("p");
        titleElement.classList.add("title");
        titleElement.classList.add("is-4");
        titleElement.textContent = fileData['name'];

        var subtitleElement = document.createElement("p");
        subtitleElement.classList.add("subtitle");
        subtitleElement.classList.add("is-6");
        subtitleElement.classList.add("has-text-weight-semibold");
        subtitleElement.textContent = "Имя - " + fileData['name'];


        mediaContentDiv.appendChild(titleElement);
        mediaContentDiv.appendChild(subtitleElement);


        var contentDiv = document.createElement("div");
        contentDiv.classList.add("content");
        contentDiv.textContent = fileData['description'];


        var columnsDiv = document.createElement("div");
        columnsDiv.classList.add("columns");


        var columnDivs = [];
        for (var i = 0; i < 4; i++) {
            var columnDiv = document.createElement("div");
            columnDiv.classList.add("column");
            columnDivs.push(columnDiv);
        }


        var labels = ["Тип: ", "Вес: ", "Скачиваний: "];
        var values = [fileData['type'], fileData['sizeKb'] + "KB", "*"];
        var spanElements = [];
        for (var i = 0; i < 3; i++) {
            var labelSpan = document.createElement("span");
            labelSpan.classList.add("is-size-7");
            labelSpan.classList.add("has-text-weight-semibold");
            labelSpan.textContent = labels[i];

            var valueSpan = document.createElement("span");
            valueSpan.classList.add("is-size-7");
            valueSpan.textContent = values[i];

            spanElements.push(labelSpan);
            spanElements.push(valueSpan);
        }


        var downloadLink = document.createElement("a");
        downloadLink.classList.add("button");
        downloadLink.classList.add("is-primary");
        downloadLink.href = "/room/download/" + fileData['id']
        downloadLink.textContent = "Скачать";

        var buttonContainer = document.createElement("div");
        buttonContainer.classList.add("is-fullwidth");
        buttonContainer.classList.add("has-text-right");
        buttonContainer.appendChild(downloadLink);

        columnDivs[0].appendChild(spanElements[0]);
        columnDivs[0].appendChild(spanElements[1]);
        columnDivs[1].appendChild(spanElements[2]);
        columnDivs[1].appendChild(spanElements[3]);
        columnDivs[2].appendChild(spanElements[4]);
        columnDivs[2].appendChild(spanElements[5]);
        columnDivs[3].appendChild(buttonContainer);

        columnsDiv.appendChild(columnDivs[0]);
        columnsDiv.appendChild(columnDivs[1]);
        columnsDiv.appendChild(columnDivs[2]);
        columnsDiv.appendChild(columnDivs[3]);


        mediaDiv.appendChild(mediaLeftDiv);
        mediaDiv.appendChild(mediaContentDiv);

        cardContentDiv.appendChild(mediaDiv);
        cardContentDiv.appendChild(contentDiv);
        cardContentDiv.appendChild(columnsDiv);

        cardDiv.appendChild(cardContentDiv);
        cardDiv.classList.add('mb-3')

        filesContainer.appendChild(cardDiv);
    }
});