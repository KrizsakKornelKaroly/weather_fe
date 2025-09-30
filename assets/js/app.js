const ServerURL = "http://localhost:3000";
let main = document.querySelector('main');
let toggleSwitch = document.querySelector('#colorSwitch')
let colorMode;
let loggedUser = null;

let mainMenu = document.querySelector('#mainMenu')
let loggedMenu = document.querySelector('#loggedMenu')

async function RenderPage(page){
    main.innerHTML = await(await fetch(`views/${page}.html`)).text();
    switch (page) {
        case 'profile':
            FillUserData();
            break;
        case 'main':
            setMinDate();
            addChangeEvent(false);
            fillOptions();
            await getWeatherData();
            displayWeatherData();
            break;
        case 'calendar':
            await getCalendarData();
            initCalendar();
            break;
        case 'chart':
            await getallData();
            chartLoad();
        default:
            break;
    }
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
    let mainContainer = document.querySelector('.container')

    if(color == 'dark'){
        mainContainer.classList.remove('bg-light')
        mainContainer.classList.add('bg-dark')
    }
    else{
        mainContainer.classList.remove('bg-dark')
        mainContainer.classList.add('bg-light')
    }
    localStorage.setItem('colorMode', color)
}

toggleSwitch.addEventListener('click', async ()=>{
    if(toggleSwitch.checked){
        SetColorMode('dark')
    }
    else{
        SetColorMode('light')
    }
    if (document.querySelector('#chartContainer')) {
        location.reload();
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