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
    const { name, portrait, city, country, tagline, price } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserDetailsDOM() {
        const container = document.createElement( 'div' );
        container.setAttribute("class", "photographer-summary");
        container.setAttribute("aria-label", "Résumé des informations du photographe");
        const h1 = document.createElement('h1');
        h1.textContent = name;
        const p1 = document.createElement( 'p' );
        p1.textContent = city+', '+country;
        const p2 = document.createElement( 'p' );
        p2.textContent = tagline;
        const aside = document.createElement('aside');
        const likesText = document.createElement('p');
        const likesCounter = document.createElement('span');
        likesCounter.setAttribute('id', 'total-likes');
        const likesIcon = document.createElement('i');
        likesIcon.classList.add('fa-solid');
        likesIcon.classList.add('fa-heart');
        likesIcon.style.color = '#000000';
        likesIcon.setAttribute('aria-label', 'likes');
        const priceText = document.createElement('p');
        priceText.textContent = price+' €/jour';
        container.appendChild(h1);
        container.appendChild(p1);
        container.appendChild(p2);
        container.appendChild(aside);
        aside.appendChild(likesText);
        likesText.appendChild(likesCounter);
        likesText.appendChild(likesIcon);
        aside.appendChild(priceText);
        return (container);
    }
    return { name, picture, getUserDetailsDOM }
}

function achievementsFactory(data) { //factory des réalisations du photographe sur sa page
    const { title, image, video, id, date, likes } = data;
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
            media.setAttribute('data-title', title);
            media.setAttribute('data-date', date);
            media.setAttribute('data-liked', 'false');
            media.setAttribute('data-likes', likes); //servira pour le compteur de likes totalLikes()
            media.setAttribute('aria-label', title+', closeup view');
            mediaContainer.appendChild(media);
            mediaContainer.setAttribute('data', 'image'); //reconnaître via CSS si c'est une image ou une vidéo
            //régler les dimensions en fonction du ratio hauteur/largeur
            setTimeout(() => {
                const ratio = media.height/media.width;
                if (ratio < 1) {
                    media.setAttribute('style', 'max-height: 300px; max-width: unset;');
                }
                if (ratio > 1) {
                    media.setAttribute('style', 'max-height: unset; max-width: 350px;');
                }
            }, 100);
        }
        if (video) {
            media = document.createElement('video');
            media.setAttribute('controls', 'false');
            media.setAttribute('data-title', title);
            media.setAttribute('data-date', date);
            media.setAttribute('data-liked', 'false');
            media.setAttribute('data-likes', likes);
            mediaContainer.appendChild(media);
            mediaContainer.setAttribute('data', 'video'); //reconnaître via CSS si c'est une image ou une vidéo
            const source = document.createElement('source');
            source.setAttribute('src', 'assets/photographers/'+photographerFirstName+'/'+video);
            source.setAttribute('type', 'video/mp4');
            media.appendChild(source);
            //media.setAttribute('style', 'max-height: unset; max-width: 350px;');
        }
        const imgDetails = document.createElement('div');
        imgDetails.setAttribute('class', 'image-details');
        imgDetails.setAttribute('aria-label', 'Détails de l\'image');
        const imgTitle = document.createElement('h2');
        //couper le titre si trop long
        if (title.length > 20) {
            imgTitle.textContent = title.slice(0,20)+'...';
        }
        else {
            imgTitle.textContent = title;
        }
        const likesButton = document.createElement('button');
        likesButton.setAttribute('onclick', 'like('+id+')');
        const likesCount = document.createElement('span');
        likesCount.textContent = likes;
        const likeIcon = document.createElement('i');
        likeIcon.classList.add('fa-solid');
        likeIcon.classList.add('fa-heart');
        likeIcon.style.color = '#901c1c';
        likeIcon.setAttribute('aria-label', 'likes');
        article.appendChild(mediaContainer);
        article.appendChild(imgDetails);
        imgDetails.appendChild(imgTitle);
        imgDetails.appendChild(likesButton);
        likesButton.appendChild(likesCount);
        likesButton.appendChild(likeIcon);
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
        const { id, portrait, name } = photographer;
        //sélectionner celui dont l'id est en paramètre de l'url
        if (id == currentPhotographerId) { //que 2 "==" car les variables ne sont pas du même type
            const photographerModel = photographerPageFactory(photographer);
            const getUserDetailsDOM = photographerModel.getUserDetailsDOM();
            const picture = `assets/photographers/${portrait}`;
            phPic.setAttribute('src', picture);
            phPic.setAttribute('alt', name);
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
            totalLikes();
        }
    });
    //par défaut, tri par ordre alphabétique
    sortMedias('title');
}

//Additionner et afficher le nombre total de likes
function totalLikes() {
    const medias = document.querySelectorAll('.media-container > *');
    let totalLikes = 0;
    medias.forEach(e => {
        const likes = parseInt(e.getAttribute('data-likes'));
        totalLikes += likes;
    });
    document.getElementById('total-likes').textContent = totalLikes;
}

//permettre de liker
function like(id) { /* eslint-disable-line no-unused-vars */
    //récupérer le media à traiter
    const media = document.querySelector('article[id="'+id+'"] > .media-container > *');
    //cibler le chiffre affiché à mettre à jour
    const likesCount = document.querySelector('article[id="'+id+'"] > .image-details > button > span');
    if (media.getAttribute('data-liked') === 'false') //seulement si on n'a pas encore liké
    {
        media.setAttribute('data-liked', 'true'); //empêcher de liker à nouveau
        let newLikes = 1; //valeur à incrémenter
        const currentLikes = parseInt(media.getAttribute('data-likes')); //nombre actuel de likes
        newLikes += currentLikes; //nouveau nombre de likes
        likesCount.textContent = newLikes; //mettre à jour l'affichage du bouton de like
        media.setAttribute('data-likes', newLikes); //mettre à jour la donnée du média
        totalLikes(); //s'en servir pour mettre à jour le compteur global du total de likes
    }
}

//afficher le média au clic sur la miniature et permettre la navigation
async function lightboxMediaDisplay(idMedia, media) {
    media.forEach((achievement) => {
        const { title, id, image, video, photographerId } = achievement;
        const mediaContainer = document.getElementById('media-container');
        //récupérer le nom du dossier contenant les médias du photographe, qui correspond à son prénom
        const photographerName = document.querySelector('.photographer-summary > h1').textContent;
        const photographerFirstName = photographerName.split(' ')[0];
        //récupérer l'id en paramètre de l'url
        const urlParams = new URLSearchParams(window.location.search);
        const currentPhotographerId = urlParams.get('id');
        //cibler le titre du media affiché
        const mediaTitle = document.querySelector('.lightbox-media-description > h3');
        //sortir tous les medias du photographe
        if (photographerId == currentPhotographerId) {
            let closeUpMedia = '';
            if (image) {
                closeUpMedia = document.createElement('img');
                closeUpMedia.setAttribute('src', 'assets/photographers/'+photographerFirstName+'/'+image); //trouver comment récupérer le nom du photographe pour l'intégrer au chemin d'accès à l'image
                closeUpMedia.setAttribute('alt', 'Photo intitulée "'+title+'" de '+photographerName);
                closeUpMedia.setAttribute('data-id', id);
                closeUpMedia.setAttribute('data-title', title);
                mediaContainer.appendChild(closeUpMedia);
                mediaContainer.setAttribute('data', 'image'); //reconnaître via CSS si c'est une image ou une vidéo
                //régler les dimensions en fonction du ratio hauteur/largeur
                const ratio = closeUpMedia.height/closeUpMedia.width;
                if (ratio < 1) {
                    closeUpMedia.setAttribute('style', 'max-height: 800px; max-width: unset;');
                }
                else {
                    closeUpMedia.setAttribute('style', 'max-height: unset; max-width: 950px;');
                }
            }
            if (video) {
                closeUpMedia = document.createElement('video');
                closeUpMedia.setAttribute('controls', 'true');
                closeUpMedia.setAttribute('data-id', id);
                closeUpMedia.setAttribute('data-title', title);
                mediaContainer.appendChild(closeUpMedia);
                mediaContainer.setAttribute('data', 'video'); //reconnaître via CSS si c'est une image ou une vidéo
                const source = document.createElement('source');
                source.setAttribute('src', 'assets/photographers/'+photographerFirstName+'/'+video);
                source.setAttribute('type', 'video/mp4');
                closeUpMedia.appendChild(source);
                //mediaContainer.setAttribute('style', 'max-height: unset; max-width: 950px;');
            }
            //n'afficher sur celui qui a été cliqué
            if (id == idMedia) {
                closeUpMedia.style.display = 'block';
                //définir data-display pour la fonction lightboxBrowse()
                closeUpMedia.setAttribute('data-display', 'true');
                mediaTitle.textContent = title;
            }
            else {
                closeUpMedia.style.display = 'none';
                //définir data-display pour la fonction lightboxBrowse()
                closeUpMedia.setAttribute('data-display', 'false');
            }
        }
    });
}

//naviguer dans la lightbox
function lightboxBrowse(direction) {
    //définir l'opérateur qui calculera le nouveau rang à afficher
    let operator = 0;
    if (direction === 'previous') {
        operator--;
    }
    else if (direction === 'next') {
        operator++;
    }
    //trouver le rang du media actuellement affiché
    const currentMedia = document.querySelector('.lightbox-media-container > *[data-display="true"]');
    const currentMediaId = currentMedia.getAttribute('data-id');
    const article = document.querySelector('.media-section article[id="'+currentMediaId+'"]');
    const currentRank = parseInt(article.style.order);
    //trouver le nouveau rang à afficher
    let newRank = currentRank + operator;
    const mediasList = document.querySelectorAll('.media-section article');
    const mediasNbr = mediasList.length;
    //si le nouveau rang à afficher est supérieur au nombre de médias, on revient à 0
    if (newRank >= mediasNbr) {
        newRank = 0;
    }
    //s'il est inférieur à 0, on reprend à la fin
    else if (newRank < 0) {
        newRank = mediasNbr-1;
    }
    let newMediaId = '';
    mediasList.forEach(e => {
        if (e.style.order == newRank) {
            newMediaId = e.getAttribute('id');
        }
    });
    //afficher le media dans la direction cliquée
    const closeUpMediasList = document.querySelectorAll('.lightbox-media-container > *');
    closeUpMediasList.forEach(e => {
        if (e.getAttribute('data-id') == newMediaId) {
            e.style.display = 'block';
            e.setAttribute('data-display', 'true');
            //cibler le titre du media affiché
            const mediaTitle = document.querySelector('.lightbox-media-description > h3');
            //récupérer le titre à afficher
            const title = e.getAttribute('data-title');
            //modifier le titre affiché
            mediaTitle.textContent = title;
        }
        else {
            e.style.display = 'none';
            e.setAttribute('data-display', 'false');
        }
    });
}

async function init() {
    // Récupère les datas des photographes
    const { photographers } = await getPhotographers();
    const { media } = await getPhotographers();
    displayData(photographers, media);
    //ouverture de la lightbox
    const lightbox = document.getElementById('lightbox');
    const modalBg = document.getElementById('modal-bg');
    const main = document.querySelector('main');
    const lightboxOpener = document.querySelectorAll('.media-section > article > .media-container');
    lightboxOpener.forEach(element => {
        const idMedia = element.parentNode.getAttribute('id');
        element.addEventListener('click', event => {
            event.preventDefault();
            lightbox.style.display = 'flex';
            lightboxMediaDisplay(idMedia, media);
            document.querySelector('body').classList.add('no-scroll');
            main.setAttribute('aria-hidden', 'true');
            lightbox.setAttribute('aria-hidden', 'false');
            modalBg.setAttribute('aria-hidden', 'false');
            modalBg.style.display = 'block';
            modalBg.style.background = '#ffffff';
        })
    })
}

init();

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const modalBg = document.getElementById('modal-bg');
    const main = document.querySelector('main');
    //cacher les éléments
    lightbox.style.display = 'none';
    modalBg.style.display = 'none';
    //rétablir le scroll
    document.querySelector('body').classList.remove('no-scroll');
    //gérer les aria-hidden
    main.setAttribute('aria-hidden', 'false');
    lightbox.setAttribute('aria-hidden', 'true');
    modalBg.setAttribute('aria-hidden', 'true');
    //supprimer le html des medias
    const images = document.querySelectorAll('#media-container img');
    images.forEach(e => {
        e.remove();
    });
    const videos = document.querySelectorAll('#media-container video');
    videos.forEach(e => {
        e.remove();
    });
}

//fermeture de la lightbox
document.getElementById('close-lightbox').addEventListener('click', e => {
    e.preventDefault();
    closeLightbox();
})

//appel de la navigation dans la lightbox
document.getElementById('lightbox-previous').addEventListener('click', e => {
    e.preventDefault();
    lightboxBrowse('previous');
})
document.getElementById('lightbox-next').addEventListener('click', e => {
    e.preventDefault();
    lightboxBrowse('next');
})

//navigation au clavier
document.addEventListener('keydown', function(e) {
    var code = e.keyCode || e.which;
    //parcourir la lightbox
    const lightbox = document.getElementById("lightbox");
    if (lightbox.getAttribute('aria-hidden') === 'false') //si la lightbox est ouverte
    {
        //echap pour fermer
        if (code == 27) {
            closeLightbox();
        }
        //flèche gauche pour previous
        if (code == 37) {
            lightboxBrowse('previous');
        }
        //flèche droite pour next
        if (code == 39) {
            lightboxBrowse('next');
        }
    }
    //parcourir le menu de tri
    const sortMenuContainer = document.getElementById('sort-menu-container');
    if (sortMenuContainer.getAttribute('data-open') === 'true') {
        //echap pour fermer
        if (code == 27) {
            toggleSortMenu();
        }
        //flèche haut pour monter (ou gauche ou tab + shift)
        if (code == 38 || code == 37 || (code == 9 && e.shiftKey))
        {
            e.preventDefault();
            sortMenuBrowse('previous');
        }
        //flèche bas pour descendre (ou droite ou tab SANS shift)
        if (code == 40 || code == 39 || (code == 9 && !e.shiftKey))
        {
            e.preventDefault();
            sortMenuBrowse('next');
        }
    }
});

//ouverture du menu de tri
document.getElementById('sort-menu-container').addEventListener('click', (e) => {
    e.preventDefault();
    toggleSortMenu();
});

function toggleSortMenu() {
    const sortMenuContainer = document.getElementById('sort-menu-container');
    const arrow = document.getElementById('sort-arrow');
    if (sortMenuContainer.getAttribute('data-open') === 'false') { //si le menu est fermé, on l'ouvre
        sortMenuContainer.style.height = '155.33px';
        sortMenuContainer.setAttribute('data-open', 'true');
        arrow.style.transform = 'rotate(180deg)';
        document.querySelector('body').classList.add('no-scroll');
        //fournir le focus à la première option
        const sortOptions = document.querySelectorAll('.sort ul li > a');
        sortOptions.forEach(e => {
            if (e.parentNode.style.order === '1') {
                e.focus();
            }
        });
    }
    else if (sortMenuContainer.getAttribute('data-open') === 'true') { //s'ile st ouvert, on le ferme
        sortMenuContainer.style.height = '51.33px';
        sortMenuContainer.setAttribute('data-open', 'false');
        arrow.style.transform = 'rotate(0deg)';
        document.querySelector('body').classList.remove('no-scroll');
        //retirer le focus des options de tri
        const sortOptions = document.querySelectorAll('.sort ul li > a');
        sortOptions.forEach(e => {
            e.blur();
        });
    }
}

//navigation dans le menu de tri
function sortMenuBrowse(direction) {
    const focused = document.querySelector('*:focus');
    const currentOrder = parseInt(focused.parentNode.style.order);
    const orders = document.querySelectorAll('.sort-menu-container ul li');
    let maxOrder = 0;
    let newOrder = 0;
    orders.forEach(() => {
        maxOrder++;
    });
    if (direction === 'previous') {
        switch (currentOrder) {
            case 1:
                //si premier
                newOrder = maxOrder;
                break;
            default:
                //si ni premier ni dernier
                newOrder = currentOrder - 1;
                break;
        }
        document.querySelector('.sort-menu-container ul li[data-order="'+newOrder+'"] a').focus();
    }
    if (direction === 'next') {
        switch (currentOrder) {
            case maxOrder:
                //si premier
                newOrder = 1;
                break;
            default:
                //si ni premier ni dernier
                newOrder = currentOrder + 1;
                break;
        }
        document.querySelector('.sort-menu-container ul li[data-order="'+newOrder+'"] a').focus();
    }
}

//appeler un nouveau tri
document.getElementById('title-sort').addEventListener('click', (e) => {
    const sortMenuContainer = document.getElementById('sort-menu-container');
    if (sortMenuContainer.getAttribute('data-open') === 'true') {
        e.preventDefault();
        sortMedias('title');
    }
});
document.getElementById('popularity-sort').addEventListener('click', (e) => {
    const sortMenuContainer = document.getElementById('sort-menu-container');
    if (sortMenuContainer.getAttribute('data-open') === 'true') {
        e.preventDefault();
        sortMedias('popularity');
    }
});
document.getElementById('date-sort').addEventListener('click', (e) => {
    const sortMenuContainer = document.getElementById('sort-menu-container');
    if (sortMenuContainer.getAttribute('data-open') === 'true') {
        e.preventDefault();
        sortMedias('date');
    }
});

//trier les medias
function sortMedias(method) {
    const medias = document.querySelectorAll('.media-section > article .media-container > *');
    let mediaTable = [];
    if (method === 'title') { //tri par ordre alphabétique
        //créer un tableau des titres
        medias.forEach(e => {
            const title = e.getAttribute('data-title');
            mediaTable.push(title);
        });
        //le ranger dans l'ordre alphabétique
        mediaTable.sort();
        //parcourir ce tableau et donner au media dont le data-title match avec l'occurence l'order correspondant à l'index
        for (let i = 0; i < mediaTable.length; i++) {
            const element = mediaTable[i]; //titre du media
            const media = document.querySelector('*[data-title="'+element+'"]'); //media dont le titre est element
            media.parentNode.parentNode.style.order = i; //donner à l'article parent la propriété order = rang alphabétique (i)
            media.setAttribute('data-order', i); //stocker cet ordre dans le media
        }
        //réordonner le menu tri
        document.getElementById('title-sort').style.order = '1';
        document.getElementById('title-sort').setAttribute('data-order', '1');
        document.getElementById('popularity-sort').style.order = '2';
        document.getElementById('popularity-sort').setAttribute('data-order', '2');
        document.getElementById('date-sort').style.order = '3';
        document.getElementById('date-sort').setAttribute('data-order', '3');
    }
    if (method === 'popularity') { //tri par ordre alphabétique
        //créer un tableau des titres
        medias.forEach(e => {
            const likesNumber = parseInt(e.getAttribute('data-likes'));
            mediaTable.push(likesNumber);
        });
        //le ranger dans l'ordre alphabétique
        mediaTable.sort((a,b) => b - a);
        //parcourir ce tableau et donner au media dont le data-likes match avec l'occurence l'order correspondant à l'index
        for (let i = 0; i < mediaTable.length; i++) {
            const element = mediaTable[i]; //nbr de likes du media
            const media = document.querySelector('*[data-likes="'+element+'"]'); //media dont le nombre de likes est element
            media.parentNode.parentNode.style.order = i; //donner à l'article parent la propriété order = rang popularité (i)
            media.setAttribute('data-order', i); //stocker cet ordre dans le media
        }
        //réordonner le menu tri
        document.getElementById('popularity-sort').style.order = '1';
        document.getElementById('popularity-sort').setAttribute('data-order', '1');
        document.getElementById('date-sort').style.order = '2';
        document.getElementById('date-sort').setAttribute('data-order', '2');
        document.getElementById('title-sort').style.order = '3';
        document.getElementById('title-sort').setAttribute('data-order', '3');
    }
    if (method === 'date') { //tri par ordre alphabétique
        //créer un tableau des titres
        medias.forEach(e => {
            const mediaDate = e.getAttribute('data-date');
            mediaTable.push(mediaDate);
        });
        //le ranger dans l'ordre alphabétique
        mediaTable.sort((a,b) => new Date(b) - new Date(a));
        //parcourir ce tableau et donner au media dont le data-date match avec l'occurence l'order correspondant à l'index
        for (let i = 0; i < mediaTable.length; i++) {
            const element = mediaTable[i]; //nbr de likes du media
            const media = document.querySelector('*[data-date="'+element+'"]'); //media dont la date est element
            media.parentNode.parentNode.style.order = i; //donner à l'article parent la propriété order = rang date (i)
            media.setAttribute('data-order', i); //stocker cet ordre dans le media
        }
        //réordonner le menu tri
        document.getElementById('date-sort').style.order = '1';
        document.getElementById('date-sort').setAttribute('data-order', '1');
        document.getElementById('title-sort').style.order = '2';
        document.getElementById('title-sort').setAttribute('data-order', '2');
        document.getElementById('popularity-sort').style.order = '3';
        document.getElementById('popularity-sort').setAttribute('data-order', '3');
    }
}