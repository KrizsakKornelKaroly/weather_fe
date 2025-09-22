function Toast(msg, type){
    //later implement.
}

function Alerts(msg, type){
    let alertPlaceholder = document.querySelector('#AlertPlaceholder')
    let alert = document.createElement('div')
    alert.classList.add('alert', `alert-${type}`, 'alert-dismissible', 'fade', 'show')

    let alertBody = document.createElement('div')
    alertBody.innerHTML = msg;

    let alertClose = document.createElement('button')
    alertClose.classList.add('btn-close')
    alertClose.dataset.bsDismiss = "alert"

    alert.appendChild(alertBody)
    alert.appendChild(alertClose)

    alertPlaceholder.appendChild(alert)

    setTimeout(() => {
        alert.remove();
    }, 3000);
}


  
