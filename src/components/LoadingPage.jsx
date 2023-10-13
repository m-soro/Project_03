import "./LoadingPage.modules.css";

export default function LoadingPage() {
  return (
    <dialog open className="LoadingPage loading-page">
      <article aria-busy="true">Loading... Please wait</article>
    </dialog>
  );
}
