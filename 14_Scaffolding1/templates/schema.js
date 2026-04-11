const SCHEMA_TEMPLATE =
`-- {{tablePascalName}} Table Creation Script
DROP TABLE IF EXISTS {{tableScreamingSnakeName}};

CREATE TABLE {{tableScreamingSnakeName}} (
{{#each columns}}
    {{name}} {{#if autoIncrement}}SERIAL{{else}}{{dbType}}{{#if hasLength}}({{length}}){{/if}}{{/if}}{{#unless nullable}} NOT NULL{{/unless}}{{#if unique}} UNIQUE{{/if}}{{#if defaultValue}} DEFAULT {{#if isString}}'{{defaultValue}}'{{else}}{{defaultValue}}{{/if}}{{/if}},
{{/each}}
    {{#if pkColumns.length}}
    PRIMARY KEY ({{#each pkColumns}}{{name}}{{#unless @last}}, {{/unless}}{{/each}})
    {{/if}}
);

COMMENT ON TABLE {{tableScreamingSnakeName}} IS '{{tableDescription}}';
{{#each columns}}
COMMENT ON COLUMN {{../tableScreamingSnakeName}}.{{name}} IS '{{comment}}';
{{/each}}`;