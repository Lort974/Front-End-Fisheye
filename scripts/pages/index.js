    async function getPhotographers() {
        // Ceci est un exemple de données pour avoir un affichage de photographes de test dès le démarrage du projet, 
        // mais il sera à remplacer avec une requête sur le fichier JSON en utilisant "fetch".
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

    async function displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");

        photographers.forEach((photographer) => {
            const photographerModel = photographerFactory(photographer); /* eslint-disable-line no-undef */
            const userCardDOM = photographerModel.getUserCardDOM();
            photographersSection.appendChild(userCardDOM);
        });
    }

    async function init() {
        // Récupère les datas des photographes
        const { photographers } = await getPhotographers();
        displayData(photographers);
    }
    
    init();
    
