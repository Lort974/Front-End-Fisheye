//Mettre le code JavaScript lié à la page photographer.html

async function getPhotographers() { //obtention des données json
    const response = await fetch("data/photographers.json");
    let photographers = "";

    if (response.ok) { // if HTTP-status is 200-299
        // get the response body
        photographers = await response.json();
    }
    else {
        alert("HTTP-Error: " + response.status);
    }
    // et bien retourner le tableau photographers seulement une fois récupéré
    return (photographers)
}

function photographerPageFactory(data) { //factory des détails du photographe sur sa page
    const { name, portrait, id, city, country, tagline, price } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserDetailsDOM() {
        const container = document.createElement( 'div' );
        container.setAttribute("class", "photographer-summary");
        container.setAttribute("aria-label", "Résumé des informations du photographe");
        const h1 = document.createElement('h1');
        h1.setAttribute("aria-label", "Voir les détails");
        h1.textContent = name;
        const p1 = document.createElement( 'p' );
        p1.textContent = city+', '+country;
        const p2 = document.createElement( 'p' );
        p2.textContent = tagline;
        const aside = document.createElement('aside');
        const priceText = document.createElement('p');
        priceText.textContent = price+' €/jour';
        const likesText = document.createElement('p');
        likesText.textContent = 'Nombre de likes';
        container.appendChild(h1);
        container.appendChild(p1);
        container.appendChild(p2);
        container.appendChild(aside);
        aside.appendChild(likesText);
        aside.appendChild(priceText);
        return (container);
    }
    return { name, picture, getUserDetailsDOM }
}

function achievementsFactory(data) { //factory des réalisations du photographe sur sa page
    const { title, image, video, id } = data;
    //récupérer le nom du dossier contenant les médias du photographe, qui correspond à son prénom
    const photographerName = document.querySelector('.photographer-summary > h1').textContent;
    const photographerFirstName = photographerName.split(' ')[0];

    function getMediaDOM() {
        
        const article = document.createElement( 'article' );
        article.setAttribute('id', id);
        const mediaContainer = document.createElement( 'div' );
        mediaContainer.setAttribute('class', 'media-container');
        let media;
        if (image) {
            media = document.createElement('img');
            media.setAttribute('src', 'assets/photographers/'+photographerFirstName+'/'+image); //trouver comment récupérer le nom du photographe pour l'intégrer au chemin d'accès à l'image
            media.setAttribute('alt', 'Photo intitulée "'+title+'" de '+photographerName);
            mediaContainer.appendChild(media);
            //régler les dimensions en fonction du ratio hauteur/largeur
            const ratio = media.height/media.width;
            if (ratio < 1) {
                media.setAttribute('style', 'max-height: 300px; max-width: unset;');
            }
            else {
                media.setAttribute('style', 'max-height: unset; max-width: 350px;');
            }
        }
        if (video) {
            media = document.createElement('video');
            media.setAttribute('controls', 'true');
            mediaContainer.appendChild(media);
            source = document.createElement('source');
            source.setAttribute('src', 'assets/photographers/'+photographerFirstName+'/'+video);
            source.setAttribute('type', 'video/mp4');
            media.appendChild(source);
            media.setAttribute('style', 'max-height: unset; max-width: 350px;');
        }
        const imgDetails = document.createElement('div');
        imgDetails.setAttribute('class', 'image-details');
        imgDetails.setAttribute('aria-label', 'Détails de l\'image');
        const imgTitle = document.createElement('h2');
        imgTitle.textContent = title;
        article.appendChild(mediaContainer);
        article.appendChild(imgDetails);
        imgDetails.appendChild(imgTitle);
        return (article);
    }
    return { getMediaDOM }
}

async function displayData(photographers, media) { //fonction qui appelle les factories et affiche les éléments créés
    //sélectionner les éléments du DOM à compléter
    const photographHeader = document.querySelector(".photograph-header");
    const mediaSection = document.querySelector('.media-section');
    //récupérer l'id en paramètre de l'url
    const urlParams = new URLSearchParams(window.location.search);
    const currentPhotographerId = urlParams.get('id');
    //sélectionner l'image à modifier (profile pic)
    const phPic = document.querySelector('#ph-pic');

    photographers.forEach((photographer) => {
        //récupérer les données du photographe
        const { id, portrait } = photographer;
        //sélectionner celui dont l'id est en paramètre de l'url
        if (id == currentPhotographerId) { //que 2 "==" car les variables ne sont pas du même type
            const photographerModel = photographerPageFactory(photographer);
            const getUserDetailsDOM = photographerModel.getUserDetailsDOM();
            const picture = `assets/photographers/${portrait}`;
            phPic.setAttribute('src', picture);
            photographHeader.appendChild(getUserDetailsDOM); //apparaîtra à la fin de la div, à rattraper avec flex order
        }
    });
    media.forEach((achievement) => {
        //récupérer les réalisations correspondant à l'id du photographe
        const { photographerId } = achievement;
        //les afficher
        if ( photographerId == currentPhotographerId) {
            const achievementList = achievementsFactory(achievement);
            const getMediaDOM = achievementList.getMediaDOM();
            mediaSection.appendChild(getMediaDOM);
        }
    });
};

async function init() {
    // Récupère les datas des photographes
    const { photographers } = await getPhotographers();
    const { media } = await getPhotographers();
    displayData(photographers, media);
};

init();