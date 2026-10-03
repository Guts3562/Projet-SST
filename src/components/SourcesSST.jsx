import React from "react";

const CHECKED_ON = "3 octobre 2026";

const sources = [
  {
    name: "Journal officiel de la République tunisienne — IORT",
    url: "https://www.iort.tn/siteiort/",
    supports:
      "Portail officiel à consulter pour retrouver les textes publiés au JORT. Les articles précis cités dans cette application restent à vérifier.",
  },
  {
    name: "Portail de la législation tunisienne",
    url: "https://legislation.tn/",
    supports:
      "Point de départ pour rechercher les textes consolidés. Les dispositions exactes et leurs amendements ne sont pas validés ici.",
  },
  {
    name: "Institut de santé et de sécurité au travail (ISST)",
    url: "https://www.isst.nat.tn/fr/",
    supports:
      "Le site institutionnel emploie le nom « Institut de santé et de sécurité au travail » (ISST). Il ne confirme pas à lui seul les normes ou obligations listées dans le projet.",
  },
  {
    name: "Caisse Nationale de Sécurité Sociale (CNSS)",
    url: "https://www.cnss.tn/",
    supports:
      "Site institutionnel de la CNSS. Le numéro, les services et les affirmations de formation mentionnés dans le projet n’ont pas été confirmés à partir d’une page officielle précise.",
  },
  {
    name: "Office national de la protection civile (ONPC)",
    url: "https://www.onpc.nat.tn/",
    supports:
      "Site institutionnel de la Protection civile. Les numéros d’urgence affichés dans le projet n’ont pas été confirmés sur une page officielle accessible.",
  },
  {
    name: "INNORPI — élaboration d’une norme tunisienne",
    url: "https://www.innorpi.tn/fr/procedure-delaboration-dune-norme-tunisienne",
    supports:
      "Informations sur la procédure d’élaboration des normes. Cette page ne confirme pas les références NT 09 ni leur champ d’application.",
  },
];

function SourcesSST() {
  return (
    <section className="card info sources-sst" aria-labelledby="sources-sst-title">
      <h3 id="sources-sst-title">
        <i className="bi bi-journal-bookmark"></i> Sources et limites de vérification
      </h3>
      <p>
        Portails consultés le <strong>{CHECKED_ON}</strong>. Cette date correspond
        à la consultation des liens, pas à une validation ni à une mise à jour de
        chaque affirmation de l’application.
      </p>
      <p>
        Les références ci-dessous sont des points de départ officiels. À cette
        date, les numéros d’urgence et de contact, les références NT, les seuils,
        les délais et les obligations précises présentés ailleurs dans ce projet
        n’ont pas été corroborés par un texte ou une page officielle spécifique.
        Ne les utilisez pas comme consignes opérationnelles ou avis de conformité
        avant vérification.
      </p>
      <ul>
        {sources.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {source.name}
            </a>
            {" — "}
            {source.supports}
          </li>
        ))}
      </ul>
      <p>
        Pour chaque donnée réglementaire conservée, ajouter la référence exacte
        (texte, article ou norme et édition), la date de vérification et la page
        officielle qui la justifie.
      </p>
    </section>
  );
}

export default SourcesSST;
