
export default function MentionsLegales() {
  return (
      <main className="flex flex-1 flex-col items-center w-full px-4 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-10 text-center">
            Mentions légales
          </h1>

          <div className="space-y-12">
            {/* Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-3 border-b pb-1">
                Éditeur du site
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Le site <strong>La Boussole Gaza</strong> est édité par
                Netcherykhet.
                <br />
                Directeur de la publication : <strong>Netcherykhet</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 border-b pb-1">
                Hébergement
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Le site est hébergé par Netlify.
                <br />
                Netlify, Inc.
                <br />
                2325 3rd Street, Suite 296, San Francisco, CA 94107
                <br />
                Site web :{" "}
                <a
                  href="https://www.netlify.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  https://www.netlify.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 border-b pb-1">
                Données personnelles
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Ce site ne collecte, ne traite et ne stocke aucune donnée
                personnelle sur ses visiteurs.
                <br />
                Aucune information n’est enregistrée en dehors des logs
                techniques nécessaires au bon fonctionnement de l’hébergement
                (Netlify).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 border-b pb-1">
                Propriété intellectuelle
              </h2>
              <p className="text-gray-700 leading-relaxed">
                L’ensemble des contenus présents sur le site (textes,
                illustrations, informations) est protégé par la législation en
                vigueur. Toute reproduction non autorisée est interdite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 border-b pb-1">
                Limitations de responsabilité
              </h2>
              <p className="text-gray-700 leading-relaxed">
                L’éditeur du site ne saurait être tenu responsable d’éventuelles
                erreurs, omissions ou indisponibilités ponctuelles du service.
                Les informations fournies le sont à titre indicatif.
              </p>
            </section>

            <p className="text-sm text-gray-500 text-right pt-6 border-t">
              Dernière mise à jour : <strong>21 novembre 2025</strong>
            </p>
          </div>
        </div>
      </main>
  );
}
