/* eslint-disable-next-line no-unused-vars */
function displayModal() {
    //ajouter le nom du photograpge dans le header de la modale
    const photographerName = document.querySelector('h1').textContent;
    const phNameSpan = document.querySelector('.modal h2 span:nth-child(3)');
    phNameSpan.textContent = photographerName;
    //---
    const modal = document.getElementById("contact_modal");
    const modalBg = document.getElementById("modal-bg");
    const main = document.getElementById('main');
    const firstname = document.getElementById('firstname');
    //afficher la modale et son background
	modal.style.display = "block";
	modalBg.style.display = "block";
    modalBg.style.background = 'rgba(196, 196, 196, 0.40)';
    //ajouter les attributs aria-hidden
    modal.setAttribute('aria-hidden', 'false');
    modalBg.setAttribute('aria-hidden', 'false');
    main.setAttribute('aria-hidden', 'true');
    //empêcher le scroll du contenu caché
    document.querySelector('body').classList.add('no-scroll');
    //focus sur la modale
    firstname.focus();
    //si le menu de tri est ouvert, on le ferme pour éviter les conflits de gestion du clavier
    const sortMenuContainer = document.getElementById('sort-menu-container');
    if (sortMenuContainer.getAttribute('data-open') === 'true') {
        toggleSortMenu(); /* eslint-disable-line no-undef */
    }
}

//fermeture de la lightbox au click sur le background
document.getElementById('modal-bg').addEventListener('click', e => {
    e.preventDefault();
    const modal = document.getElementById("contact_modal");
    if (modal.getAttribute('aria-hidden') === 'false') //si la lightbox est ouverte
    {
        closeModal();
    }
});

function closeModal() {
    const modal = document.getElementById("contact_modal");
    const modalBg = document.getElementById("modal-bg");
    const main = document.querySelector("main");
    //masquer la modale et son background
    modal.style.display = "none";
    modalBg.style.display = "none";
    //ajouter les attributs aria-hidden
    modal.setAttribute('aria-hidden', 'true');
    modalBg.setAttribute('aria-hidden', 'true');
    main.setAttribute('aria-hidden', 'false');
    //rétablir le scroll du contenu caché
    document.querySelector('body').classList.remove('no-scroll');
}

//gestion des touches du clavier
document.addEventListener('keydown', function(e) {
    var code = e.keyCode || e.which;
    //echap pour fermer
    if (code == 27) {
        closeModal();
    }
    //parcourir la modale
    const modal = document.getElementById("contact_modal");
    const focused = document.querySelector('*:focus');
    const firstname = document.getElementById('firstname');
    const lastname = document.getElementById('lastname');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const submitBtn = document.getElementById('submit');
    if (modal.getAttribute('aria-hidden') === 'false') //si la modale est ouverte
    {
        if (code == 9 && !e.shiftKey) { //touche tab SANS shift
            //si on est sur le bouton d'envoi, on preventDefault et on reprend en premier input
            if (focused.getAttribute('id') === 'submit') {
                e.preventDefault();
                firstname.focus();
            }
        }
        // dans le cas de maj+tab (pour remonter)
        if (code == 9 && e.shiftKey) { //touche tab ET shift
            //si on est sur le premier input, on preventDefault et on reprend au bouton d'envoi
            if (focused.getAttribute('id') === 'firstname') {
                e.preventDefault();
                submitBtn.focus();
            }
        }
        // quand on appuie sur entrée et que le focus est sur le submit
        if (code == 13 && focused.getAttribute('id') === 'submit') {
            e.preventDefault()
            console.log('Prénom : '+firstname.value);
            console.log('Nom : '+lastname.value);
            console.log('Email : '+email.value);
            console.log('Message : '+message.value);
        }
    }
});

//gestion de l'envoi du formulaire
document.getElementById('submit').addEventListener('click', function(e) {
    e.preventDefault();
    const firstname = document.getElementById('firstname');
    const lastname = document.getElementById('lastname');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    console.log('Prénom : '+firstname.value);
    console.log('Nom : '+lastname.value);
    console.log('Email : '+email.value);
    console.log('Message : '+message.value);
});