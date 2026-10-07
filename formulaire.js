/* Le formulaire de contact de la copie statique de showkids.fr (#77, #131) : même apparence que Contact Form 7 (mêmes
   classes et messages), mais envoyé à la plateforme Show Event / Show Kids, où il arrive en « Nouvelle demande ».
   Corps en x-www-form-urlencoded : requête « simple », pas de pré-requête CORS. */
(function () {
  var ADRESSE = 'https://client.showkids.fr/api/v1/demande-showkids';
  var form = document.querySelector('form[data-plateforme]');
  if (!form) return;
  var sortie = form.querySelector('.wpcf7-response-output');
  var bouton = form.querySelector('[type=submit]');
  var CHAMPS = { 'your-name': 'nom', 'tel-995': 'tel', 'your-email': 'email', 'select-510': 'type', 'your-location': 'lieu', 'your-message': 'message' };

  function dire(texte, etat) {
    form.classList.remove('invalid', 'sent', 'failed', 'submitting');
    if (etat) form.classList.add(etat);
    form.setAttribute('data-status', etat || 'init');
    if (sortie) { sortie.textContent = texte; sortie.setAttribute('aria-hidden', texte ? 'false' : 'true'); }
  }
  function marquer(nomChamp, texte) {
    var el = form.querySelector('[name="' + nomChamp + '"]');
    if (!el) return;
    el.setAttribute('aria-invalid', 'true');
    var tip = document.createElement('span');
    tip.className = 'wpcf7-not-valid-tip';
    tip.setAttribute('aria-hidden', 'true');
    tip.textContent = texte;
    el.parentNode.appendChild(tip);
  }
  function nettoyer() {
    form.querySelectorAll('.wpcf7-not-valid-tip').forEach(function (t) { t.remove(); });
    form.querySelectorAll('[aria-invalid="true"]').forEach(function (e) { e.setAttribute('aria-invalid', 'false'); });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    nettoyer();
    var manque = false;
    form.querySelectorAll('[aria-required="true"]').forEach(function (el) {
      if (!el.value.trim()) { marquer(el.name, 'Veuillez renseigner ce champ.'); manque = true; }
    });
    if (manque) return dire('Un ou plusieurs champs contiennent une erreur. Veuillez vérifier et essayer à nouveau.', 'invalid');

    var corps = new URLSearchParams();
    Object.keys(CHAMPS).forEach(function (n) { var el = form.querySelector('[name="' + n + '"]'); if (el) corps.append(CHAMPS[n], el.value.trim()); });
    var piege = form.querySelector('[name="site_web"]');
    corps.append('site_web', piege ? piege.value : '');
    corps.append('page', location.pathname);
    form.classList.add('submitting');
    if (bouton) bouton.disabled = true;
    fetch(ADRESSE, { method: 'POST', body: corps, headers: { 'Accept': 'application/json' }, credentials: 'omit' })
      .then(function (r) { return r.json().then(function (j) { return { code: r.status, j: j }; }, function () { return { code: r.status, j: {} }; }); })
      .then(function (res) {
        if (res.code === 201 || res.code === 200) { form.reset(); return dire('Merci pour votre message. Il a été envoyé.', 'sent'); }
        if (res.code === 422 && res.j.errors) {
          var inverse = {}; Object.keys(CHAMPS).forEach(function (n) { inverse[CHAMPS[n]] = n; });
          Object.keys(res.j.errors).forEach(function (k) { if (inverse[k]) marquer(inverse[k], res.j.errors[k][0]); });
          return dire('Un ou plusieurs champs contiennent une erreur. Veuillez vérifier et essayer à nouveau.', 'invalid');
        }
        if (res.code === 429) return dire('Trop d’envois en peu de temps. Réessayez dans quelques minutes, ou appelez-nous.', 'failed');
        dire('Une erreur s’est produite lors de l’envoi de votre message. Veuillez essayer à nouveau plus tard.', 'failed');
      })
      .catch(function () { dire('Une erreur s’est produite lors de l’envoi de votre message. Veuillez essayer à nouveau plus tard.', 'failed'); })
      .then(function () { if (bouton) bouton.disabled = false; form.classList.remove('submitting'); });
  });
})();
