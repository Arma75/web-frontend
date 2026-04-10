const MAPPER_XML_TEMPLATE =
`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.{{teamName}}.{{projectName}}.{{tableName}}.mapper.{{tablePascalName}}Mapper">
    <sql id="whereConditions">
        <where>
        {{#each findAllConditionColumns~}}
          {{~#if isString}}
          <if test="{{fieldName}} != null and {{fieldName}} != ''">
            AND {{name}} LIKE '%' || #{ {{~fieldName~}} } || '%'
          </if>
          {{else if isLocalDateTime}}
          <if test="{{fieldName}}Start != null">
            AND {{name}} <![CDATA[>=]]> #{ {{~fieldName~}}Start}
          </if>
          <if test="{{fieldName}}End != null">
            AND {{name}} <![CDATA[<=]]> #{ {{~fieldName~}}End}
          </if>
          {{else}}
          <if test="{{fieldName}} != null">
            AND {{name}} = #{ {{~fieldName~}} }
          </if>
          {{/if~}}
            {{#unless @last}}

            {{/unless}}
        {{/each}}

        </where>
    </sql>

    <insert id="create" parameterType="{{tablePascalName}}SaveRequest">
        INSERT INTO {{tableScreamingSnakeName}}
        (
            {{#each columnsWithoutAutoIncrement}}
            {{#unless @first}},{{else}} {{/unless}} {{name}}
            {{/each}}
        )
        VALUES
        (
            {{#each columnsWithoutAutoIncrement}}
            {{#unless @first}},{{else}} {{/unless}} {{#if isCreateTimestamp}}CURRENT_TIMESTAMP{{else if isUpdateTimestamp}}CURRENT_TIMESTAMP{{else if hasDefaultValue}}{{#if isString}}COALESCE(#{ {{~fieldName~}} }, '{{defaultValue}}'){{else}}COALESCE(#{ {{~fieldName~}} }, {{defaultValue}}){{/if}}{{else}}#{ {{~fieldName~}} }{{/if}}
            {{/each}}
        )
    </insert>

    <insert id="createBulk" parameterType="java.util.List">
        INSERT INTO {{tableScreamingSnakeName}}
        (
            {{#each columnsWithoutAutoIncrement}}
            {{#unless @first}},{{else}} {{/unless}} {{name}}
            {{/each}}
        )
        VALUES
        <foreach collection="list" item="item" separator=",">
        (
            {{#each columnsWithoutAutoIncrement}}
            {{#unless @first}},{{else}} {{/unless}} {{#if isCreateTimestamp}}CURRENT_TIMESTAMP{{else if isUpdateTimestamp}}CURRENT_TIMESTAMP{{else if hasDefaultValue}}{{#if isString}}COALESCE(#{ {{~fieldName~}} }, '{{defaultValue}}'){{else}}COALESCE(#{ {{~fieldName~}} }, {{defaultValue}}){{/if}}{{else}}#{ {{~fieldName~}} }{{/if}}
            {{/each}}
        )
        </foreach>
    </insert>

    <select id="findBy{{#each pkColumns}}{{this.fieldPascalName}}{{/each}}" parameterType="{{#each pkColumns}}{{javaType}}{{/each}}" resultType="{{tablePascalName}}Response">
        SELECT {{#each columns}}{{#unless @first}}             , {{/unless}}{{name}}
               {{/each}}
          FROM {{tableScreamingSnakeName}}
         WHERE {{#each pkColumns}}{{name}} = #{ {{~fieldName~}} }{{#unless @last}} AND {{/unless}}{{/each}}
    </select>

    <select id="findAll" parameterType="{{tablePascalName}}SearchRequest" resultType="{{tablePascalName}}Response">
        SELECT {{#each columns}}{{#unless @first}}             , {{/unless}}{{name}}
               {{/each}}
          FROM {{tableScreamingSnakeName}}
        <include refid="whereConditions" />
         ORDER BY 
        <choose>
          <when test="sort != null and sort != ''">
                  \${sort} 
          </when>
          <otherwise>
                  {{#each pkColumns}}{{#unless @first}}                , {{/unless}}{{name}} DESC
                  {{/each}}
          </otherwise>
        </choose>
         LIMIT #{size} OFFSET #{offset}
    </select>

    <select id="countAll" parameterType="{{tablePascalName}}SearchRequest" resultType="long">
        SELECT COUNT(*)
          FROM {{tableScreamingSnakeName}}
        <include refid="whereConditions" />
    </select>

    <update id="update" parameterType="{{tablePascalName}}SaveRequest">
        UPDATE {{tableScreamingSnakeName}}
           SET {{#each updateColumns}}{{#unless @first}}             , {{/unless}}{{#if isUpdateTimestamp}}{{name}} = CURRENT_TIMESTAMP{{else}}{{name}} = #{ {{~fieldName~}} }{{/if}}
               {{/each}}
         WHERE {{#each pkColumns}}{{name}} = #{ {{~fieldName~}} }{{#unless @last}} AND {{/unless}}{{/each}}
    </update>

    <update id="updateBulk" parameterType="java.util.List">
        <foreach collection="list" item="item" separator=";">
        UPDATE {{tableScreamingSnakeName}}
           SET {{#each updateColumns}}{{#unless @first}}             , {{/unless}}{{#if isUpdateTimestamp}}{{name}} = CURRENT_TIMESTAMP{{else}}{{name}} = #{item. {{~fieldName~}} }{{/if}}
               {{/each}}
         WHERE {{#each pkColumns}}{{name}} = #{item.{{fieldName~}} }{{#unless @last}} AND {{/unless}}{{/each}}
        </foreach>
    </update>

    <update id="patch" parameterType="{{tablePascalName}}SaveRequest">
        UPDATE {{tableScreamingSnakeName}}
           SET {{#if hasUpdateTimeStampColumn}}{{updateTimeStampColumn.name}} = CURRENT_TIMESTAMP{{else}}{{pkColumns.[0].name}} = #{ {{~pkColumns.[0].fieldName~}} }{{/if}}
          {{#each updateColumns~}}{{~#unless isUpdateTimestamp~}}
          <if test="{{fieldName}} != null">
             , {{name}} = #{ {{~fieldName~}} }
          </if>
          {{~/unless~}}{{~/each}}
         WHERE {{#each pkColumns}}{{name}} = #{ {{~fieldName~}} }{{#unless @last}} AND {{/unless}}{{/each}}
    </update>

    <update id="patchBulk" parameterType="java.util.List">
        <foreach collection="list" item="item" separator=";">
        UPDATE {{tableScreamingSnakeName}}
           SET {{#if hasUpdateTimeStampColumn}}{{updateTimeStampColumn.name}} = CURRENT_TIMESTAMP{{else}}{{pkColumns.[0].name}} = #{ {{~pkColumns.[0].fieldName~}} }{{/if}}
          {{#each updateColumns~}}{{~#unless isUpdateTimestamp~}}
          <if test="item.{{fieldName}} != null">
             , {{name}} = #{item.{{fieldName~}} }
          </if>
          {{~/unless~}}{{~/each}}
         WHERE {{#each pkColumns}}{{name}} = #{item.{{fieldName~}} }{{#unless @last}} AND {{/unless}}{{/each}}
        </foreach>
    </update>
    {{#if hasLogicalUseColumn}}

    <update id="unuse" parameterType="{{#each pkColumns}}{{javaType}}{{/each}}">
        UPDATE {{tableScreamingSnakeName}} 
           SET {{logicalUseColumn.name}} = 'N'
             , {{#if hasUpdateTimeStampColumn}}{{updateTimeStampColumn.name}} = CURRENT_TIMESTAMP{{/if}}
         WHERE {{#each pkColumns}}{{name}} = #{ {{~fieldName~}} }{{#unless @last}} AND {{/unless}}{{/each}}
    </update>

    <update id="unuseBulk" parameterType="java.util.List">
        UPDATE {{tableScreamingSnakeName}} 
           SET {{logicalUseColumn.name}} = 'N'
             , {{#if hasUpdateTimeStampColumn}}{{updateTimeStampColumn.name}} = CURRENT_TIMESTAMP{{/if}}
         WHERE {{#if isSinglePk}}{{pkColumns.[0].name}} IN
        <foreach collection="list" item="id" open="(" separator="," close=")">
               #{id}
        </foreach>
        {{else}}
        <foreach collection="list" item="item" separator=" OR ">
            ({{#each pkColumns}}{{name}} = #{item.{{fieldName~}} }{{#unless @last}} AND {{/unless}}{{/each}})
        </foreach>
        {{/if}}
    </update>
    {{/if}}
    
    <delete id="delete" parameterType="{{#each pkColumns}}{{javaType}}{{/each}}">
        DELETE
          FROM {{tableScreamingSnakeName}}
         WHERE {{#each pkColumns}}{{name}} = #{ {{~fieldName~}} }{{#unless @last}} AND {{/unless}}{{/each}}
    </delete>
    
    <delete id="deleteBulk" parameterType="java.util.List">
        DELETE
          FROM {{tableScreamingSnakeName}}
         WHERE {{#if isSinglePk}}{{pkColumns.[0].name}} IN
        <foreach collection="list" item="id" open="(" separator="," close=")">
               #{id}
        </foreach>
        {{else}}
        <foreach collection="list" item="item" separator=" OR ">
            ({{#each pkColumns}}{{name}} = #{item.{{fieldName~}} }{{#unless @last}} AND {{/unless}}{{/each}})
        </foreach>
        {{/if}}
    </delete>

</mapper>`;