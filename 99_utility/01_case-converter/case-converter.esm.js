export function toSnakeCase(str) {
    if (!str) {
        return '';
    }

    return str.replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s\-]+/g, '_')
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');
}

export function toScreamingSnakeCase(str) {
    return toSnakeCase(str).toUpperCase();
}

export function toCamelCase(str) {
    return toSnakeCase(str).replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

export function toPascalCase(str) {
    const camelCase = toCamelCase(str);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

export function toKebabCase(str) {
    return toSnakeCase(str).replace(/_/g, '-');
}