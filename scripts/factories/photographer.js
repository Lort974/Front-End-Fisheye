function photographerFactory(data) {
    const { name, portrait, id, city, country, tagline, price } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        article.setAttribute("aria-label", "Fiche photographe");
        const a = document.createElement('a');
        a.setAttribute("aria-label", "Voir les détails");
        a.setAttribute("href", "photographer.html?id="+id);
        const imgContainer = document.createElement( 'div' );
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture);
        img.setAttribute("alt", "Photo de "+name);
        const h2 = document.createElement( 'h2' );
        h2.textContent = name;
        const p1 = document.createElement( 'p' );
        p1.textContent = city+', '+country;
        const p2 = document.createElement( 'p' );
        p2.textContent = tagline;
        const p3 = document.createElement( 'p' );
        p3.textContent = price+'€/jour';
        article.appendChild(a);
        a.appendChild(imgContainer);
        imgContainer.appendChild(img);
        a.appendChild(h2);
        article.appendChild(p1);
        article.appendChild(p2);
        article.appendChild(p3);
        return (article);
    }
    return { name, picture, getUserCardDOM }
}