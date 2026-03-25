const SCHEMA_TEMPLATE =
`-- {{tablePascalName}} Table Creation Script
DROP TABLE IF EXISTS {{tableScreamingSnakeName}};

CREATE TABLE {{tableScreamingSnakeName}} (
{{#each columns}}
    {{options.name}} {{#if isAutoIncrement}}SERIAL{{else}}{{options.type}}{{#if isString}}({{length}}){{/if}}{{/if}}{{#unless nullable}} NOT NULL{{/unless}}{{#if defaultValue}} DEFAULT {{defaultValue}}{{/if}},
{{/each}}
    {{#if pkColumns.length}}
    PRIMARY KEY ({{#each pkColumns}}{{options.name}}{{#unless @last}}, {{/unless}}{{/each}})
    {{/if}}
);

COMMENT ON TABLE {{tableScreamingSnakeName}} IS '{{tableDescription}}';
{{#each columns}}
COMMENT ON COLUMN {{../tableScreamingSnakeName}}.{{options.name}} IS '{{options.comment}}';
{{/each}}`;