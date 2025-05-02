document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('#upload-file-btn')
    const modal = document.querySelector('#upload-modal')
    const closeModalBtn = document.querySelector('#upload-modal .modal-close')
    const fileInput = document.querySelector('#upload-modal .file-input')
    const fileNameSpan = document.querySelector('#upload-modal .file-name')
    const fileBlock = document.querySelector('#upload-modal .file')
    
    function openModal(e) {
        modal.classList.add('is-active')
    }

    function closeModal(e) {
        e.target.parentNode.classList.remove('is-active')
    }

    btn.addEventListener('click', openModal)
    closeModalBtn.addEventListener('click', closeModal)

    fileInput.addEventListener('change', () => {
        const fileName = fileInput.files[0].name
        fileNameSpan.textContent = fileName
        fileBlock.classList.remove('is-link')
        fileBlock.classList.add('is-primary')
    })
});