// Renderiza datos estructurados schema.org como <script type="application/ld+json">.
// Server component; seguro para inyectar el JSON serializado.
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
