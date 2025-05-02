document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.querySelector("#file-download-btn")
    const fileId = downloadBtn.getAttribute("data")
    downloadBtn.addEventListener("click", downloadFile)

    function downloadFile(e) {
        // todo
    }
})