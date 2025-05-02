document.addEventListener('DOMContentLoaded', () => {
    // create room modal
    const btn = document.querySelector('.add-room-card')
    const modal = document.querySelector('#room-modal')
    const closeModalBtn = document.querySelector('#room-modal .modal-close')

    const createRoomBtn = document.querySelector("#create-room-btn")
    const cancelCreatingBtn = document.querySelector("#cancel-creating-btn")
    const roomNameInput = document.querySelector("#room-name")
    const errorText = document.querySelector('#create-error-message')


    function openModal(e) {
        modal.classList.add('is-active')
    }

    function closeModal(e) {
        console.log(e.target.parentNode)
        e.target.parentNode.classList.remove("is-active")
    }

    btn.addEventListener('click', openModal)
    closeModalBtn.addEventListener('click', closeModal)
    cancelCreatingBtn.addEventListener('click', (e) => {
        closeModalBtn.click()
    })

    createRoomBtn.addEventListener('click', (e) => {
        let roomName = roomNameInput.value
        if (roomName.length === 0) {
            errorText.classList.remove('is-hidden')
            errorText.textContent = "Вы ввели пустое название"
        } else {
            const data = {
                "admin": 1,
                "name": roomName
            }

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
            console.log(JSON.stringify(data))

            fetch("/room/create", options)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("error")
                    }
                    return response.json()
                })
                .then(data => {
                    if ("id" in data) {
                        window.location.href = "/room/" + data["id"] + "/files"
                    } else {
                        throw new Error("error")
                    }
                })
                .catch(ex => {
                    showMessage("Не удалось создать комнату. Попробуйте позже")
                    console.log(ex)
                })
        }
    })

    function showMessage(message) {
        errorText.textContent = message
        errorText.classList.remove("is-hidden")
    }
    // </end create room mode>
});