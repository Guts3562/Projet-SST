import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { getLanguage, localized, setLanguage, useLanguage } from "../lib/language";
import LogoutConfirmModal from "./Login/LogoutConfirmModal";
import "./Admin.css";

const SECTIONS = [
  { id: "overview", icon: "bi bi-grid-1x2" },
  { id: "users", icon: "bi bi-people" },
  { id: "results", icon: "bi bi-clipboard-data" },
  { id: "questions", icon: "bi bi-patch-question" },
  { id: "settings", icon: "bi bi-gear" },
];

const emptyQuestion = {
  text: "",
  category: "",
  optionsText: "",
  correct: 0,
  source_url: "",
  source_reference: "",
  verified_at: "",
  status: "draft",
};

function Admin({ user, onLogout }) {
  const language = useLanguage();
  const [section, setSection] = useState("overview");
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [questionForm, setQuestionForm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [settingsLanguage, setSettingsLanguage] = useState(getLanguage);
  const [settingsTheme, setSettingsTheme] = useState(
    () => localStorage.getItem("theme") || "system",
  );

  const text = useCallback(
    (french, english) => localized(language, french, english),
    [language],
  );

  const sectionLabel = (id) => {
    const labels = {
      overview: ["Vue d’ensemble", "Overview"],
      users: ["Comptes", "Accounts"],
      results: ["Résultats", "Results"],
      questions: ["Contenu du quiz", "Quiz content"],
      settings: ["Paramètres", "Settings"],
    };
    const [french, english] = labels[id];
    return text(french, english);
  };

  const loadSection = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      if (section === "overview") setOverview(await api.admin.getOverview());
      if (section === "users") setUsers(await api.admin.getUsers());
      if (section === "results") setResults(await api.admin.getQuizResults());
      if (section === "questions") setQuestions(await api.admin.getQuestions());
    } catch (loadError) {
      console.error("Failed to load administrator data:", loadError);
      setError(text("Impossible de charger les données. Veuillez réessayer.", "Could not load data. Please try again."));
    } finally {
      setIsLoading(false);
    }
  }, [section, text]);

  useEffect(() => {
    loadSection();
  }, [loadSection]);

  const changeRole = async (account, system_role) => {
    setError("");
    setNotice("");
    try {
      await api.admin.setUserRole(account.id, system_role);
      setNotice(text(
        `Rôle mis à jour pour ${account.email}.`,
        `Role updated for ${account.email}.`,
      ));
      await loadSection();
    } catch (updateError) {
      console.error("Failed to update account role:", updateError);
      setError(text("Impossible de modifier le rôle du compte.", "Could not update the account role."));
    }
  };

  const editQuestion = (question) => {
    setQuestionForm(
      question
        ? {
            ...question,
              status: question.status === "archived" ? "draft" : question.status,
              optionsText: question.options.join("\n"),
            verified_at: question.verified_at
              ? new Date(question.verified_at).toISOString().slice(0, 10)
              : "",
          }
        : { ...emptyQuestion },
    );
    setError("");
    setNotice("");
  };

  const saveQuestion = async (event) => {
    event.preventDefault();
    const options = questionForm.optionsText
      .split("\n")
      .map((option) => option.trim())
      .filter(Boolean);
    const question = { ...questionForm, options };
    delete question.optionsText;
    setError("");
    setNotice("");
    try {
      await api.admin.saveQuestion(question);
      setQuestionForm(null);
      setNotice(text("La question du quiz a été enregistrée.", "Quiz question saved."));
      await loadSection();
    } catch (saveError) {
      console.error("Failed to save quiz question:", saveError);
      setError(text("Impossible d’enregistrer la question. Vérifiez les champs et la source.", "Could not save the question. Check the fields and source details."));
    }
  };

  const archiveQuestion = async (question) => {
    if (!window.confirm(text(
      `Archiver cette question ?\n\n${question.text}`,
      `Archive this question?\n\n${question.text}`,
    ))) return;
    setError("");
    setNotice("");
    try {
      await api.admin.archiveQuestion(question.id);
      setNotice(text("La question a été archivée.", "Question archived."));
      await loadSection();
    } catch (archiveError) {
      console.error("Failed to archive question:", archiveError);
      setError(text("Impossible d’archiver la question.", "Could not archive the question."));
    }
  };

  const renderOverview = () => (
    <>
      <div className="admin-stat-grid">
        <article className="admin-stat-card">
          <span>{text("Comptes inscrits", "Registered accounts")}</span>
          <strong>{overview?.users ?? "—"}</strong>
          <i className="bi bi-people"></i>
        </article>
        <article className="admin-stat-card">
          <span>{text("Tentatives de quiz", "Quiz attempts")}</span>
          <strong>{overview?.quizResults ?? "—"}</strong>
          <i className="bi bi-bar-chart"></i>
        </article>
        <article className="admin-stat-card">
          <span>{text("Questions publiées", "Published questions")}</span>
          <strong>{overview?.questions?.published ?? "—"}</strong>
          <i className="bi bi-patch-check"></i>
        </article>
        <article className="admin-stat-card">
          <span>{text("Questions en brouillon", "Draft questions")}</span>
          <strong>{overview?.questions?.drafts ?? "—"}</strong>
          <i className="bi bi-file-earmark-text"></i>
        </article>
      </div>
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>{text("Activité récente de l’administration", "Recent administrator activity")}</h2>
            <p>{text("Modifications des rôles et du contenu du quiz.", "Role changes and quiz content actions.")}</p>
          </div>
          <i className="bi bi-clock-history"></i>
        </div>
        {overview?.recentActivity?.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{text("Action", "Action")}</th>
                  <th>{text("Cible", "Target")}</th>
                  <th>{text("Administrateur", "Administrator")}</th>
                  <th>{text("Date", "Date")}</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentActivity.map((activity) => (
                  <tr key={activity.id}>
                    <td>{({
                      "set_role:admin": text("Accès administrateur accordé", "Administrator access granted"),
                      "set_role:client": text("Accès client accordé", "Client access granted"),
                      create: text("Question créée", "Question created"),
                      "update:draft": text("Brouillon modifié", "Draft updated"),
                      "update:published": text("Question publiée ou modifiée", "Published question updated"),
                      archive: text("Question archivée", "Question archived"),
                    })[activity.action] || activity.action}</td>
                    <td>{text(
                      activity.target_type === "user" ? "Compte" : "Question",
                      activity.target_type === "user" ? "Account" : "Question",
                    )} #{activity.target_id}</td>
                    <td>{activity.full_name || activity.email || text("Compte supprimé", "Account removed")}</td>
                    <td>{new Date(activity.created_at).toLocaleString(language === "fr" ? "fr-FR" : "en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-empty">{text("Aucune action enregistrée pour le moment.", "No recorded actions yet.")}</p>
        )}
      </section>
    </>
  );

  const renderUsers = () => (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <h2>{text("Gestion des accès", "Account access")}</h2>
          <p>{text("Gérez les rôles système. Le métier du profil est un champ distinct.", "Manage system roles. Occupation/profile roles are separate.")}</p>
        </div>
        <i className="bi bi-person-gear"></i>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{text("Nom", "Name")}</th>
              <th>{text("Courriel", "Email")}</th>
              <th>{text("Profession", "Occupation")}</th>
              <th>{text("Accès système", "System access")}</th>
              <th>{text("Inscription", "Joined")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((account) => (
              <tr key={account.id}>
                <td>{account.full_name || "—"}</td>
                <td>{account.email}</td>
                <td>
                  {account.occupation === "administrator"
                    ? text("Administrateur", "Administrator")
                    : account.occupation || "—"}
                </td>
                <td>
                  <select
                    aria-label={text(`Rôle système de ${account.email}`, `System role for ${account.email}`)}
                    value={account.system_role}
                    disabled={account.id === user.id}
                    onChange={(event) => changeRole(account, event.target.value)}
                  >
                    <option value="client">Client</option>
                    <option value="admin">{text("Administrateur", "Administrator")}</option>
                  </select>
                </td>
                <td>{new Date(account.created_at).toLocaleDateString(language === "fr" ? "fr-FR" : "en-GB")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="admin-footnote">
        {text(
          "Votre propre accès administrateur ne peut pas être modifié ici. Le dernier compte administrateur ne peut pas être rétrogradé.",
          "Your own administrator access cannot be changed here. The last administrator account cannot be demoted.",
        )}
      </p>
    </section>
  );

  const renderResults = () => (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <h2>{text("Résultats des quiz", "Quiz results")}</h2>
          <p>{text("Résultats enregistrés pour l’ensemble des comptes.", "Saved results across all accounts.")}</p>
        </div>
        <i className="bi bi-clipboard-data"></i>
      </div>
      {results.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{text("Participant", "Participant")}</th>
                <th>{text("Courriel", "Email")}</th>
                <th>{text("Profession", "Occupation")}</th>
                <th>{text("Score", "Score")}</th>
                <th>{text("Résultat", "Percentage")}</th>
                <th>{text("Date", "Date")}</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id}>
                  <td>{result.noun || text("Compte supprimé", "Deleted account")}</td>
                  <td>{result.email || "—"}</td>
                  <td>
                    {result.role === "administrator"
                      ? text("Administrateur", "Administrator")
                      : result.role || "—"}
                  </td>
                  <td>{result.score} / {result.total}</td>
                  <td>
                    {result.total > 0
                      ? `${Math.round((result.score / result.total) * 100)}%`
                      : "—"}
                  </td>
                  <td>
                    {new Date(result.created_at).toLocaleString(
                      language === "fr" ? "fr-FR" : "en-GB",
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="admin-empty">{text("Aucun résultat de quiz enregistré.", "No quiz results have been recorded.")}</p>
      )}
    </section>
  );

  const renderQuestions = () => (
    <>
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>{text("Banque de questions du quiz", "Quiz question bank")}</h2>
            <p>{text(
              "Les questions publiées sont visibles par les clients. Leur publication exige une source et une date de vérification.",
              "Published questions are visible to clients. Publishing requires source details and a verification date.",
            )}</p>
          </div>
          <button className="admin-primary-button" onClick={() => editQuestion()}>
            <i className="bi bi-plus-lg"></i> {text("Nouvelle question", "New question")}
          </button>
        </div>
        <div className="admin-question-list">
          {questions.map((question) => (
            <article className="admin-question-row" key={question.id}>
              <div>
                <span className={`admin-status ${question.status}`}>
                  {({
                    draft: text("Brouillon", "Draft"),
                    published: text("Publiée", "Published"),
                    archived: text("Archivée", "Archived"),
                  })[question.status] || question.status}
                </span>
                <span className="admin-question-category">{question.category}</span>
                <h3>{question.text}</h3>
                <p>
                  {question.options.length} {text("réponses", "options")}
                  {question.source_reference
                    ? ` · ${text("Source", "Source")} : ${question.source_reference}`
                    : ` · ${text("Aucune source enregistrée", "No source recorded")}`}
                </p>
              </div>
              <div className="admin-row-actions">
                <button
                  className="admin-secondary-button"
                  onClick={() => editQuestion(question)}
                >
                  {text("Modifier", "Edit")}
                </button>
                {question.status !== "archived" && (
                  <button
                    className="admin-danger-button"
                    onClick={() => archiveQuestion(question)}
                  >
                    {text("Archiver", "Archive")}
                  </button>
                )}
              </div>
            </article>
          ))}
          {!questions.length && !isLoading && (
            <p className="admin-empty">{text("Aucune question de quiz trouvée.", "No quiz questions found.")}</p>
          )}
        </div>
      </section>

      {questionForm && (
        <div className="admin-modal-backdrop" role="presentation">
          <form className="admin-editor" onSubmit={saveQuestion}>
            <div className="admin-panel-heading">
              <div>
                <h2>{questionForm.id ? text("Modifier la question", "Edit question") : text("Nouvelle question", "New question")}</h2>
                <p>{text("Associez une source vérifiable à chaque information publiée.", "Keep a traceable source with every published fact.")}</p>
              </div>
              <button
                type="button"
                className="admin-icon-button"
                aria-label={text("Fermer l’éditeur", "Close editor")}
                onClick={() => setQuestionForm(null)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <label>
              {text("Énoncé de la question", "Question text")}
              <textarea
                required
                maxLength={2000}
                value={questionForm.text}
                onChange={(event) =>
                  setQuestionForm({ ...questionForm, text: event.target.value })
                }
              />
            </label>
            <div className="admin-form-grid">
              <label>
                {text("Catégorie", "Category")}
                <input
                  required
                  maxLength={100}
                  value={questionForm.category}
                  onChange={(event) =>
                    setQuestionForm({ ...questionForm, category: event.target.value })
                  }
                />
              </label>
              <label>
                {text("Bonne réponse", "Correct option")}
                <select
                  value={questionForm.correct}
                  onChange={(event) =>
                    setQuestionForm({
                      ...questionForm,
                      correct: Number(event.target.value),
                    })
                  }
                >
                  {(questionForm.optionsText.split("\n").filter((option) => option.trim())).map((option, index) => (
                    <option key={`${index}-${option}`} value={index}>
                      {String.fromCharCode(65 + index)} — {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              {text("Réponses possibles (une par ligne)", "Answer options (one per line)")}
              <textarea
                required
                rows={5}
                value={questionForm.optionsText}
                onChange={(event) =>
                  setQuestionForm({ ...questionForm, optionsText: event.target.value })
                }
              />
            </label>
            <label>
              {text("Adresse de la source", "Source URL")}
              <input
                type="url"
                value={questionForm.source_url || ""}
                onChange={(event) =>
                  setQuestionForm({ ...questionForm, source_url: event.target.value })
                }
              />
            </label>
            <label>
              {text("Référence exacte de la source", "Exact source reference")}
              <input
                value={questionForm.source_reference || ""}
                onChange={(event) =>
                  setQuestionForm({
                    ...questionForm,
                    source_reference: event.target.value,
                  })
                }
                placeholder={text("Titre du document, article/section et édition", "Document title, article/section and edition")}
              />
            </label>
            <div className="admin-form-grid">
              <label>
                {text("Vérifiée le", "Verified on")}
                <input
                  type="date"
                  value={questionForm.verified_at || ""}
                  onChange={(event) =>
                    setQuestionForm({ ...questionForm, verified_at: event.target.value })
                  }
                />
              </label>
              <label>
                {text("État de publication", "Publication status")}
                <select
                  value={questionForm.status}
                  onChange={(event) =>
                    setQuestionForm({ ...questionForm, status: event.target.value })
                  }
                >
                  <option value="draft">{text("Brouillon", "Draft")}</option>
                  <option value="published">{text("Publiée", "Published")}</option>
                </select>
              </label>
            </div>
            {error && <p className="admin-alert error">{error}</p>}
            <div className="admin-row-actions">
              <button
                type="button"
                className="admin-secondary-button"
                onClick={() => setQuestionForm(null)}
              >
                {text("Annuler", "Cancel")}
              </button>
              <button type="submit" className="admin-primary-button">
                {text("Enregistrer la question", "Save question")}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );

  const applyAdminSettings = () => {
    setLanguage(settingsLanguage);
    localStorage.setItem("theme", settingsTheme);
    document.documentElement.classList.remove("light-mode", "dark-mode");
    if (settingsTheme === "light" || settingsTheme === "dark") {
      document.documentElement.classList.add(`${settingsTheme}-mode`);
    }
    setNotice(localized(settingsLanguage, "Les paramètres ont été appliqués.", "Settings applied."));
  };

  const renderSettings = () => (
    <section className="admin-panel admin-settings">
      <div className="admin-panel-heading">
        <div>
          <h2>{text("Paramètres de l’administration", "Administrator settings")}</h2>
          <p>{text("Personnalisez la langue et l’apparence de votre interface.", "Customize your interface language and appearance.")}</p>
        </div>
      </div>
      <div className="admin-settings-grid">
        <label className="admin-setting-control">
          <span>{text("Langue de l’interface", "Interface language")}</span>
          <select value={settingsLanguage} onChange={(event) => setSettingsLanguage(event.target.value)}>
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </label>
        <label className="admin-setting-control">
          <span>{text("Apparence", "Appearance")}</span>
          <select value={settingsTheme} onChange={(event) => setSettingsTheme(event.target.value)}>
            <option value="system">{text("Selon le système", "Use system setting")}</option>
            <option value="light">{text("Clair", "Light")}</option>
            <option value="dark">{text("Sombre", "Dark")}</option>
          </select>
        </label>
      </div>
      <button className="admin-primary-button" type="button" onClick={applyAdminSettings}>
        <i className="bi bi-check2"></i> {text("Appliquer les changements", "Apply changes")}
      </button>
    </section>
  );

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-icon"><i className="bi bi-shield-lock"></i></span>
          <span><strong>SST Admin</strong><small>{text("Espace de gestion", "Management workspace")}</small></span>
        </div>
        <nav aria-label={text("Navigation administrateur", "Administrator navigation")}>
          {SECTIONS.map((item) => (
            <button
              key={item.id}
              className={section === item.id ? "active" : ""}
              onClick={() => {
                setError("");
                setNotice("");
                setQuestionForm(null);
                setSection(item.id);
              }}
            >
              <i className={item.icon}></i>{sectionLabel(item.id)}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <span><i className="bi bi-person-circle"></i> {user.email}</span>
          <button onClick={() => setIsLogoutModalOpen(true)}>
            <i className="bi bi-box-arrow-right"></i> {text("Se déconnecter", "Sign out")}
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span>{text("ESPACE ADMINISTRATEUR", "ADMINISTRATOR WORKSPACE")}</span>
            <h1>{sectionLabel(section)}</h1>
          </div>
          <span className="admin-access-badge"><i className="bi bi-shield-check"></i> {text("Accès administrateur", "Admin access")}</span>
        </header>
        <div className="admin-content">
          {error && !questionForm && <p className="admin-alert error" role="alert">{error}</p>}
          {notice && <p className="admin-alert success" role="status">{notice}</p>}
          {isLoading && <p className="admin-empty" role="status">{text("Chargement des données…", "Loading administrator data…")}</p>}
          {!isLoading && section === "overview" && renderOverview()}
          {!isLoading && section === "users" && renderUsers()}
          {!isLoading && section === "results" && renderResults()}
          {!isLoading && section === "questions" && renderQuestions()}
          {!isLoading && section === "settings" && renderSettings()}
        </div>
      </main>
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={onLogout}
        language={language}
      />
    </div>
  );
}

export default Admin;
