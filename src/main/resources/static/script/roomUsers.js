document.addEventListener('DOMContentLoaded', () => {
    const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,16}$/;

    const ROOM_ID = getRoomId()

    const openModalBtn = document.querySelector('#add-room-card')
    const modal = document.querySelector('#add-user-modal')
    const usernameInput = modal.querySelector('#username-input')
    const messageBlock = modal.querySelector('.message')
    const messageText = modal.querySelector('.message-body')
    const btn = modal.querySelector('.button')
    const closeBtn = modal.querySelector('.modal-close')

    openModalBtn.addEventListener('click', openModal)
    closeBtn.addEventListener('click', closeModal)

    function openModal(e) {
        clearModal()
        modal.classList.add('is-active')
    }

    function clearModal() {
        usernameInput.value = ''
        clearMessageBlock()
    }

    function closeModal(e) {
        modal.classList.remove('is-active')
    }

    btn.addEventListener('click', (e) => {
        clearMessageBlock()
        if (!USERNAME_REGEX.test(usernameInput.value)) {
            messageText.classList.remove('is-hidden')
            messageBlock.classList.add('is-danger')
            messageText.textContent = 'Введите валидный username'
        } else {
            let data = {
                room_id: ROOM_ID,
                username: usernameInput.value
            }

            let options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }

            fetch('/room/add_user', options)
                .then(response => {
                    if (response.status === 400) {
                        return response.json().then(data => {
                            throw Error(data['error'])
                        })
                    } else if (!response.ok) {
                        throw Error('Не удалось добавить пользователя в комнату.')
                    }
                    return response.json()
                })
                .then(data => {
                    messageBlock.classList.add('is-success')
                    messageText.classList.remove('is-hidden')
                    messageText.textContent = "Пользователь успешно добавлен!"
                })
                .catch(err => {
                    messageBlock.classList.add('is-danger')
                    messageText.textContent = err.message
                    messageText.classList.remove('is-hidden')
                })
        }
    })

    function clearMessageBlock() {
        messageBlock.classList.remove('is-success')
        messageBlock.classList.remove('is-danger')
        messageText.classList.add('is-hidden')
    }

    function getRoomId() {
        let currentUrl = window.location.href
        let parts = currentUrl.split("/")
        return parts[parts.length - 2]
    }
})