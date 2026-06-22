import { type SchemaTypeDefinition } from "sanity";
import { schemaTypes } from "../schemas";

// Usa nuestros modelos de contenido (producto, categoria, cupon, promo).
export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes as SchemaTypeDefinition[],
};
