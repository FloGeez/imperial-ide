import "./Loader.css";

export function Loader() {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="back-section-left"></div>
        <div className="back-section-right"></div>
        <div className="main-section"></div>
        <div className="scan-effect"></div>
      </div>
      <div className="engine-glow-container">
        <div className="engine-glow-main"></div>
        <div className="engine-glow-side left"></div>
        <div className="engine-glow-side right"></div>
      </div>
    </div>
  );
}
