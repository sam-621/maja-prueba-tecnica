export const stripMarkdown = (markdown: string): string => {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ') // bloques de código
    .replace(/`([^`]+)`/g, '$1') // código inline
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // imágenes
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // enlaces -> solo el texto
    .replace(/^\s{0,3}#{1,6}\s+/gm, '') // encabezados
    .replace(/^\s{0,3}>\s?/gm, '') // citas
    .replace(/^\s{0,3}([-*+]|\d+\.)\s+/gm, '') // marcadores de lista
    .replace(/^\s{0,3}([-*_])\s*(?:\1\s*){2,}$/gm, ' ') // separadores ---
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // negrita
    .replace(/(\*|_)(.*?)\1/g, '$2') // cursiva
    .replace(/~~(.*?)~~/g, '$1') // tachado
    .replace(/\s+/g, ' ') // colapsar espacios/saltos
    .trim();
};
