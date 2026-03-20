const MAPPER_XML_TEMPLATE =
`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.{{teamName}}.{{projectName}}.{{tableName}}.mapper.{{tablePascalName}}Mapper">
    <sql id="whereConditions">
        <where>
        {{#each columns~}}
          {{~#if isString}}
          
          <if test="{{fieldName}} != null and {{fieldName}} != ''">
            AND {{options.name}} LIKE '%' || #{ {{~fieldName~}} } || '%'
          </if>
          {{else if isLocalDateTime}}

          <if test="{{fieldName}}Start != null">
            AND {{options.name}} <![CDATA[>=]]> #{ {{~fieldName~}}Start}
          </if>
          <if test="{{fieldName}}End != null">
            AND {{options.name}} <![CDATA[<=]]> #{ {{~fieldName~}}End}
          </if>
          {{else}}

          <if test="{{fieldName}} != null">
            AND {{options.name}} = #{ {{~fieldName~}} }
          </if>
          {{/if~}}
        {{/each}}

        </where>
    </sql>

    <insert id="create" parameterType="{{tablePascalName}}SaveRequest">
        INSERT INTO {{tableScreamingSnakeName}}
        (
            {{#each columnsWithoutAutoIncrement}}
            {{#unless @first}},{{else}} {{/unless}} {{options.name}}
            {{/each}}
        )
        VALUES
        (
            {{#each columnsWithoutAutoIncrement}}
            {{#unless @first}},{{else}} {{/unless}} #{ {{~fieldName~}} }
            {{/each}}
        )
    </insert>

    <insert id="createBulk" parameterType="java.util.List">
        INSERT INTO {{tableScreamingSnakeName}}
        (
            {{#each columnsWithoutAutoIncrement}}
            {{#unless @first}},{{else}} {{/unless}} {{options.name}}
            {{/each}}
        )
        VALUES
        <foreach collection="list" item="item" separator=",">
        (
            {{#each columnsWithoutAutoIncrement}}
            {{#unless @first}},{{else}} {{/unless}} #{ {{~fieldName~}} }
            {{/each}}
        )
        </foreach>
    </insert>

    <select id="findById" resultType="{{tablePascalName}}Response">
        SELECT {{#each columns}}{{#unless @first}}             , {{/unless}}{{options.name}}
               {{/each}}
          FROM {{tableScreamingSnakeName}}
         WHERE {{#each pkColumns}}{{options.name}} = #{ {{~fieldName~}} }{{#unless @last}} AND {{/unless}}{{/each}}
    </select>

    <select id="findAll" parameterType="{{tablePascalName}}SearchRequest" resultType="{{tablePascalName}}Response">
        SELECT {{#each columns}}{{#unless @first}}             , {{/unless}}{{options.name}}
               {{/each}}
          FROM {{tableScreamingSnakeName}}
        <include refid="whereConditions" />
         ORDER BY 
        <choose>
          <when test="sort != null and sort != ''">
                  \${sort} 
          </when>
          <otherwise>
                  {{#each pkColumns}}{{#unless @first}}                , {{/unless}}{{options.name}} DESC
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
           SET {{#each columns}}{{#unless @first}}             , {{/unless}}{{options.name}} = #{ {{~fieldName~}} }
               {{/each}}
         WHERE {{#each pkColumns}}{{options.name}} = #{ {{~fieldName~}} }{{#unless @last}} AND {{/unless}}{{/each}}
    </update>

    <update id="updateBulk" parameterType="java.util.List">
        <foreach collection="list" item="item" separator=";">
        UPDATE {{tableScreamingSnakeName}}
           SET {{#each columns}}{{#unless @first}}             , {{/unless}}{{options.name}} = #{ {{~fieldName~}} }
               {{/each}}
         WHERE {{#each pkColumns}}{{options.name}} = #{item.{{fieldName~}} }{{#unless @last}} AND {{/unless}}{{/each}}
        </foreach>
    </update>

    <update id="patch" parameterType="{{tablePascalName}}SaveRequest">
        UPDATE {{tableScreamingSnakeName}}
           SET {{pkColumns.[0].options.name}} = #{ {{~pkColumns.[0].fieldName~}} }
          {{#each columns}}
          <if test="{{fieldName}} != null">
             , {{options.name}} = #{ {{~fieldName~}} }
          </if>
          {{/each}}
         WHERE {{#each pkColumns}}{{options.name}} = #{ {{~fieldName~}} }{{#unless @last}} AND {{/unless}}{{/each}}
    </update>

    <update id="patchBulk" parameterType="java.util.List">
        <foreach collection="list" item="item" separator=";">
        UPDATE {{tableScreamingSnakeName}}
           SET {{pkColumns.[0].options.name}} = #{ {{~pkColumns.[0].fieldName~}} }
          {{#each columns}}
          <if test="item.{{fieldName}} != null">
             , {{options.name}} = #{item.{{fieldName~}} }
          </if>
          {{/each}}
         WHERE {{#each pkColumns}}{{options.name}} = #{item.{{fieldName~}} }{{#unless @last}} AND {{/unless}}{{/each}}
        </foreach>
    </update>

    <update id="unuse">
        UPDATE {{tableScreamingSnakeName}} 
           SET UPD_DTM = CURRENT_TIMESTAMP
             , USE_YN = 'N'
         WHERE {{#each pkColumns}}{{options.name}} = #{ {{~fieldName~}} }{{#unless @last}} AND {{/unless}}{{/each}}
    </update>

    <update id="unuseBulk" parameterType="java.util.List">
        UPDATE {{tableScreamingSnakeName}} 
           SET UPD_DTM = CURRENT_TIMESTAMP
             , USE_YN = 'N'
         WHERE {{#if isSinglePk}}{{pkColumns.[0].options.name}} IN
        <foreach collection="list" item="id" open="(" separator="," close=")">
               #{id}
        </foreach>
        {{else}}
        <foreach collection="list" item="item" separator=" OR ">
            ({{#each pkColumns}}{{options.name}} = #{item.{{fieldName~}} }{{#unless @last}} AND {{/unless}}{{/each}})
        </foreach>
        {{/if}}
    </update>
    
    <delete id="delete">
        DELETE
          FROM {{tableScreamingSnakeName}}
         WHERE {{#each pkColumns}}{{options.name}} = #{ {{~fieldName~}} }{{#unless @last}} AND {{/unless}}{{/each}}
    </delete>
    
    <delete id="deleteBulk" parameterType="java.util.List">
        DELETE
          FROM {{tableScreamingSnakeName}}
         WHERE {{#if isSinglePk}}{{pkColumns.[0].options.name}} IN
        <foreach collection="list" item="id" open="(" separator="," close=")">
               #{id}
        </foreach>
        {{else}}
        <foreach collection="list" item="item" separator=" OR ">
            ({{#each pkColumns}}{{options.name}} = #{item.{{fieldName~}} }{{#unless @last}} AND {{/unless}}{{/each}})
        </foreach>
        {{/if}}
    </delete>

</mapper>`;