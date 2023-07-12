//navigation au clavier
document.addEventListener('keydown', function(e) {
    var code = e.keyCode || e.which;
    //parcourir la page
    const pageTitle = document.querySelector('h1').textContent; //titre de la page
    let lastFocusable = '';
    if (pageTitle === 'Nos photographes') { //après vérification, si on est sur index.html
        lastFocusable = 'a';//le dernier élément focusable sera un lien
    }
    else {
        lastFocusable = 'button';//sinon, ce sera un bouton
    }
    const firstElement = document.querySelector('header > a:has(> .logo)');//premier élément focusable de la page
    const lastElement = document.querySelector('main > section article:last-child '+lastFocusable);//dernier élément focusable
    //créer une boucle pour éviter de sortir du html
    if (code == 9 && !e.shiftKey && document.activeElement === lastElement) // si tab SANS shift ET focus sur dernier élément
    {
        firstElement.focus(); //go focus sur le premier élément
    }
    if (code == 9 && e.shiftKey && document.activeElement === firstElement) // si tab PLUS shift ET focus sur premier élément
    {
        lastElement.focus(); //go focus sur le dernier élément
    }
});