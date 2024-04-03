const miForm = document.querySelector('form')

miForm.addEventListener('submit', (ev) => {
  ev.preventDefault()
  const formData = {}

  for (let el of miForm.elements) {
    if (el.name.length > 0) {
      formData[el.name] = el.value
    }
  }

  fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
    .then((resp) => resp.json())
    .then(({ msg, token }) => {
      if (msg) {
        return console.error(msg)
      }

      // Guardo el token en el localStorage
      localStorage.setItem('token', token)
      window.location = 'chat.html'
    })
    .catch((err) => {
      console.log(err)
    })
})

function handleCredentialResponse(response) {
  // Google Token : ID_TOKEN
  const body = { id_token: response.credential }

  fetch('http://localhost:8080/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then(({ token }) => {
      // Guardo el token en el localStorage
      localStorage.setItem('token', token)
      window.location = 'chat.html'
    })
    .catch(console.warn)
}

const button = document.getElementById('google_signout')
button.onclick = () => {
  console.log(google.accounts.id)
  google.accounts.id.revoke(localStorage.getItem('email'), (done) => {
    localStorage.clear()
    location.reload()
  })
}
