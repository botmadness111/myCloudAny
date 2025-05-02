document.addEventListener("DOMContentLoaded", () => {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const NAME_REGEX = /^[A-ZА-Я][^0-9A-ZА-Я]*$/
    const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,16}$/;
    const btn = document.querySelector('#signup-btn')
    
    const nameInput = document.querySelector('#name')
    const nameMessage = document.querySelector("#field-name .help")

    const usernameInput = document.querySelector('#username')
    const usernameMessage = document.querySelector('#field-username .help')
    
    const emailInput = document.querySelector('#email')
    const emailMessage = document.querySelector('#field-email .help')
    
    const passwordInput = document.querySelector('#password')
    const passwordMessage = document.querySelector('#field-password .help')
    
    const repeatPasswordInput = document.querySelector('#repeat-password')
    const repeatPasswordMessage = document.querySelector('#field-repeat-password .help')

    const messageBlock = document.querySelector('.message')
    const messageText = document.querySelector('.message-body')
    btn.addEventListener('click', (e) => {
        e.preventDefault()
        let isValid = checkValid()
        if (isValid) {
            let data = {
                name: nameInput.value.trim(),
                username: usernameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value.trim()
            }

            let options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            }

            fetch("/register", options)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Не удалось зарегестрироваться, попробуйте позже.')

                    }
                    return response.json()
                }).then(data => {
                    if ("result" in data && data['result'] === "success") {
                        messageBlock.classList.remove("is-danger")
                        messageBlock.classList.add("is-success")
                        messageBlock.classList.remove("is-hidden")
                        messageText.textContent = "Вы успешно зарегестрировались. Сейчас произойдет перенаправление на страницу входа"
                        setTimeout(function() {
                            window.location.href = "/user/rooms";
                        }, 1000);
                    } else {
                        if ("result" in data && data['result'].includes('exists')) {
                            throw new Error('Пользователь с таким e-mail или username существует!')
                        } else {
                            throw new Error('Не удалось зарегестрироваться, попробуйте позже.')
                        }
                    }
                }).catch(ex => {
                    console.log(ex)
                    messageBlock.classList.remove('is-hidden')
                    messageText.textContent = ex.message
                })
        }
    })

    function checkValid() {
        clearAdditionalInfo()

        let isValid = true
        let nameValue = nameInput.value.trim()
        let usernameValue = usernameInput.value.trim()
        let emailValue = emailInput.value.trim()
        let passwordValue = passwordInput.value.trim()
        let repeatPasswordValue = repeatPasswordInput.value.trim()
        
        if (nameValue === '') {
            nameInput.classList.add('is-danger')
            nameMessage.classList.remove('is-hidden')
            nameMessage.textContent = 'Заполните поле'
            isValid = false
        } else {
            if (!NAME_REGEX.test(nameValue)) {
                nameInput.classList.add('is-danger')
                nameMessage.classList.remove('is-hidden')
                nameMessage.textContent = 'Имя должно начинаться с заглавной буквы и не должно больше содержать заглавных букв'
                isValid = false
            } else {
                nameInput.classList.add('is-success')
            }
        }
        
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
        
        if (emailValue === '') {
            emailInput.classList.add('is-danger')
            emailMessage.classList.remove('is-hidden')
            emailMessage.textContent = 'Заполните поле'
            isValid = false
        } else {
            if (!EMAIL_REGEX.test(emailValue)) {
                emailInput.classList.add('is-danger')
                emailMessage.classList.remove('is-hidden')
                emailMessage.textContent = 'E-mail не валиден.'
            } else {
                emailInput.classList.add('is-success')
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

        if (repeatPasswordValue === '') {
            repeatPasswordInput.classList.add('is-danger')
            repeatPasswordMessage.classList.remove('is-hidden')
            repeatPasswordMessage.textContent = 'Заполните поле'
            isValid = false
        } else {
            repeatPasswordInput.classList.add('is-success')
        }

        if (passwordValue != '' && repeatPasswordValue != '') {
            if (!(passwordValue === repeatPasswordValue)) {
                passwordInput.classList.add('is-danger')
                passwordInput.classList.remove('is-success')
                passwordMessage.classList.remove('is-hidden')
                passwordMessage.textContent = 'Пароли не совпадают'

                repeatPasswordInput.classList.add('is-danger')
                repeatPasswordInput.classList.remove('is-success')
                repeatPasswordMessage.classList.remove('is-hidden')
                repeatPasswordMessage.textContent = 'Пароли не совпадают'
                
                isValid = false
            }
        }
        return isValid;
    }

    function clearAdditionalInfo() {
        nameInput.classList.remove('is-danger')
        nameMessage.classList.add('is-hidden')

        usernameInput.classList.remove('is-danger')
        usernameMessage.classList.add('is-hidden')

        emailInput.classList.remove('is-danger')
        emailMessage.classList.add('is-hidden')

        passwordInput.classList.remove('is-danger')
        passwordMessage.classList.add('is-hidden')

        repeatPasswordInput.classList.remove('is-danger')
        repeatPasswordMessage.classList.add('is-hidden')
    }
})