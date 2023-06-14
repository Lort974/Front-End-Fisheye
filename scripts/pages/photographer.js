//Mettre le code JavaScript lié à la page photographer.html

async function getPhotographers() {
    const response = await fetch("data/photographers.json");
    let photographers = "";

    if (response.ok) { // if HTTP-status is 200-299
        // get the response body
        photographers = await response.json();
    }
    else {
        alert("HTTP-Error: " + response.status);
    }
    console.log(photographers)
    // et bien retourner le tableau photographers seulement une fois récupéré
    return (photographers)
}

async function displayData(photographers) {
    //récupérer l'id en paramètre de l'url
    const urlParams = new URLSearchParams(window.location.search);
    const currentPhotographerId = urlParams.get('id');
    //sélectionner les éléments du dom à modifier
    phName = document.querySelector('#ph-name');
    phCity = document.querySelector('#ph-city');
    phTagline = document.querySelector('#ph-tagline');
    phPic = document.querySelector('#ph-pic');

    photographers.forEach((photographer) => {
        //récupérer les données du photographe
        const { name, portrait, id, city, country, tagline, price } = photographer;
        //sélectionner celui dont l'id est en paramètre de l'url
        if (id == currentPhotographerId) { //que 2 "==" car les variables ne sont pas du même type
            phName.textContent = name;
            phCity.textContent = city+', '+country;
            phTagline.textContent = tagline;
            phPic.setAttribute('src', 'assets/photographers/'+portrait);
            phPic.setAttribute('alt', 'Portrait de '+name);
        }
    });
};

async function init() {
    // Récupère les datas des photographes
    const { photographers } = await getPhotographers();
    displayData(photographers);
};

init();