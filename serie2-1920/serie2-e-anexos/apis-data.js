const rp = require('request-promise')

module.exports = {
    post: post,
    get: get
}

function post(options, handleResponse, handleError) {

    options['method'] = 'POST'

    rp(options)
    .then(resp => handleResponse(resp))
    .catch(error => handleError(error))

}


function get(options, handleResponse, handleError) {

    options['method'] = 'GET'

    rp(options)
    .then(resp => handleResponse(resp))
    .catch(error => handleError(error))

}