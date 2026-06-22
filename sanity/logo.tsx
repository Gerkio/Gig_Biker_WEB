// Logo de marca para la barra de navegacion del Studio.
export function BigBikerLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {/* /logo.png se sirve desde /public (ruta absoluta, ignora el basePath) */}
      <img src="/logo.png" alt="Big Biker" style={{ height: 26, width: "auto" }} />
      <span
        style={{
          fontWeight: 800,
          letterSpacing: "0.08em",
          color: "#FDB92E",
          fontSize: 14,
          textTransform: "uppercase",
        }}
      >
        Big Biker CMS
      </span>
    </div>
  );
}
