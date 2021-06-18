export default httpClient => ({
  register: async ({ name, email, password }) => {
    let errors = null
    const response = await httpClient.post('/auth/register', {
      name,
      email,
      password
    })

    if (!response.data) {
      errors = {
        status: response.request.status,
        statusText: response.request.statusText
      }
    }
    return {
      data: response.data,
      errors
    }
  },
  login: async ({ email, password }) => {
    let errors = null
    const response = await httpClient.post('/auth/login', {
      email,
      password
    })

    if (!response.data) {
      errors = {
        status: response.request.status,
        statusText: response.request.statusText
      }
    }
    return {
      data: response.data,
      errors
    }
  }
})
