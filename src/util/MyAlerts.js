import Swal from 'sweetalert2'

export function AlertInfo (title, msg, error) {
    Swal.fire({
        title: title,
        text: msg,
        icon: !error ? 'success' : 'error',
    })
}

export function AlertLoading (title, timer) {
    let timerInterval
    Swal.fire({
        title: title,
        timer: timer,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
        }
    })
}
