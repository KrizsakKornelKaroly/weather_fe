const ServerURL = "http://localhost:3000";
let main = document.querySelector('main');
let toggleSwitch = document.querySelector('#colorSwitch')
let colorMode;
let loggedUser = null;

let mainMenu = document.querySelector('#mainMenu')
let loggedMenu = document.querySelector('#loggedMenu')

async function RenderPage(page){
    main.innerHTML = await(await fetch(`views/${page}.html`)).text();

} 

function LoadColorMode(){
    if(localStorage.getItem('colorMode')){
        colorMode = localStorage.getItem('colorMode')
        if(colorMode == 'dark'){
            toggleSwitch.checked = true;
        }
        else{
            toggleSwitch.checked = false;
        }
        SetColorMode(colorMode)
    } 
}

function SetColorMode(color){
    document.documentElement.setAttribute('data-bs-theme', color)
    localStorage.setItem('colorMode', color)
}

toggleSwitch.addEventListener('click', ()=>{
    if(toggleSwitch.checked){
        SetColorMode('dark')
    }
    else{
        SetColorMode('light')
    }
} )

async function LoggedUserCache() {
    if(sessionStorage.getItem('loggedUser')){
        loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'))
        mainMenu.classList.add('d-none')
        loggedMenu.classList.remove('d-none')
        await RenderPage('main');
    }
    else{
        loggedUser = null;
        mainMenu.classList.remove('d-none')
        loggedMenu.classList.add('d-none')
        await RenderPage('login');
    }
}

LoadColorMode();
LoggedUserCache();