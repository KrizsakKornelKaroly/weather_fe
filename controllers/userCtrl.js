const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function Register() {
    let nameField = document.querySelector('#nameField')
    let emailField = document.querySelector('#emailField')
    let passwdField = document.querySelector('#passwdField')
    let confirmPasswdField = document.querySelector('#confirmpasswdField')

    if(nameField.value == '' || emailField.value == '' || passwdField.value == '' || confirmPasswdField.value == ''){
        Alerts('Hiányzó adatok!', 'danger')
        return;
    }
    if(passwdField.value != confirmPasswdField.value){
        Alerts('A jelszavak nem egyeznek!', 'danger')
        return;
    }
    if(!passwdRegExp.test(passwdField.value)){
        Alerts('A jelszó nem elég biztonságos!', 'danger')
        return;
    }
    if(!emailRegExp.test(emailField.value)){
        Alerts('Az email cím formátuma nem megfelelő!', 'danger')
        return;
    }

    try {
        const res = await fetch(`${ServerURL}/users`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    name: nameField.value,
                    email: emailField.value,
                    password: passwdField.value
                }
            )
        });
        let alertStatus = res.status == 200 ? 'success' : 'danger';
        const data = await res.json();
        Alerts(`${data.msg}`, alertStatus);
        if (res.status == 200) {
            nameField.value = "";
            emailField.value = "";
            passwdField.value = "";
            confirmPasswdField.value = "";
        }


    } catch (error) {
        console.log('Hiba: ', error)
    }



}

async function Login() {
    let emailField = document.querySelector('#emailField')
    let passwdField = document.querySelector('#passField')

    if(emailField.value == '' || passwdField.value == ''){
        Alerts('Hiányzó adatok!', 'danger')
        return;
    }

    try {
        const res = await fetch(`${ServerURL}/users/login`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    email: emailField.value,
                    password: passwdField.value
                }
            )
        });

        let valasz = await res.json();

        if(valasz.status == "400"){
            Alerts(valasz.msg, 'danger')
        }


    } catch (error) {
        console.log('Hiba: ', error)
    }
}
