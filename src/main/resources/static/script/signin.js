document.addEventListener("DOMContentLoaded", () => {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,16}$/;


    const btn = document.querySelector('#signin-btn')
    const passwordInput = document.querySelector('#password')
    const passwordMessage = document.querySelector('#field-password .help')

    const usernameInput = document.querySelector('#username')
    const usernameMessage = document.querySelector('#field-username .help')

    const messageBlock = document.querySelector('.message')
    const messageText = document.querySelector('.message-body')

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('error')) {
        messageBlock.classList.remove("is-hidden")
        messageText.textContent = "Вход не удался. Проверьте данные!"
    }

    const form = document.querySelector('form')
    form.addEventListener('submit', function (e) {
        e.preventDefault()
        let isValid = checkValid()
        if (isValid) {
            this.submit()
        }
    })
    // btn.addEventListener('click', (e) => {
    //     e.preventDefault()
    //     let isValid = checkValid()
    //     if (isValid) {
    //         let formData = new FormData();
    //         formData.append('username', usernameInput.value);
    //         formData.append('password', passwordInput.value);
    //
    //         let options = {
    //             method: 'POST',
    //             body: formData
    //         }
    //
    //         fetch("/login", options)
    //             .then(response => {
    //                 if (!response.ok) {
    //                     throw new Error("Не удалось войти в систему. Проверьте данные!")
    //                 }
    //                 console.log(response.text())
    //                 return response.json()
    //             })
    //             .then(data => {
    //                 console.log(data)
    //                 window.location.href = "/"
    //             })
    //             .catch(ex => {
    //                 console.log(ex)
    //                 messageBlock.classList.remove("is-hidden")
    //                 messageText.textContent = ex.message
    //             })
    //     }
    // })

    function checkValid() {
        clearAdditionalInfo()

        let isValid = true
        let usernameValue = usernameInput.value.trim()
        let passwordValue = passwordInput.value.trim()

        if (usernameValue === '') {
            usernameInput.classList.add('is-danger')
            usernameMessage.classList.remove('is-hidden')
            usernameMessage.textContent = 'Заполните поле'
            isValid = false
        } else {
            if (!USERNAME_REGEX.test(usernameValue)) {
                usernameInput.classList.add('is-danger')
                usernameMessage.classList.remove('is-hidden')
                usernameMessage.textContent = 'Юзернейм должен сосять из букв латниского алфавита и иметь длинну от 3 до 16 знаков.'
            } else {
                usernameInput.classList.add('is-success')
            }
        }
        if (passwordValue === '') {
            passwordInput.classList.add('is-danger')
            passwordMessage.classList.remove('is-hidden')
            passwordMessage.textContent = 'Заполните поле'
            isValid = false       
        } else {
            passwordInput.classList.add('is-success')
        }
        return isValid;
    }

    function clearAdditionalInfo() {
        usernameInput.classList.remove('is-danger')
        usernameMessage.classList.add('is-hidden')

        passwordInput.classList.remove('is-danger')
        passwordMessage.classList.add('is-hidden')
    }
})