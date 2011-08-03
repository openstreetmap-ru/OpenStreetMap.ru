-- clear table search_osm
DELETE FROM search_osm;

-- insert region
INSERT INTO
  search_osm(
  addr_type,
  id_link,
  type_link,
  ver_link,
  full_name,
  region,
  member_role,
  geom)
SELECT 
  'region' as addr_type,
  relations.id AS id_link,
  'R' as type_link,
  relations.version as ver_link,
  coalesce(relations.tags->'name',relations.tags->'place_name') AS full_name,
  coalesce(relations.tags->'name',relations.tags->'place_name') AS region,
  relation_members.member_role as member_role,  
  ((ST_Dump(ST_Polygonize(ways.linestring))).geom) as geom
FROM
  relations,
  relation_members,
  ways
WHERE
  relations.id=relation_members.relation_id
  AND relation_members.member_id=ways.id
  AND relations.tags->'admin_level' = '4' 
  AND relations.tags->'type' = 'boundary' 
  AND relations.tags->'addr:country' = 'RU'
GROUP BY
  id_link,
  type_link,
  ver_link,
  full_name,
  region,
  member_role;

-- insert district
INSERT INTO
  search_osm(
  addr_type,
  id_link,
  type_link,
  ver_link,
  district,
  member_role,
  geom)
SELECT 
  'district' as addr_type,
  relations.id AS id_link,
  'R' as type_link,
  relations.version as ver_link,
  coalesce(relations.tags->'name',relations.tags->'place_name') AS district,
  relation_members.member_role as member_role,
  ((ST_Dump(ST_Polygonize(ways.linestring))).geom) as geom
FROM
  relations,
  relation_members,
  ways
WHERE
  relations.id=relation_members.relation_id
  AND relation_members.member_id=ways.id
  AND relations.tags->'admin_level' = '6' 
  AND relations.tags->'type' = 'boundary' 
  AND ways.linestring is not null
GROUP BY
  id_link,
  type_link,
  ver_link,
  district,
  member_role;

--INSERT INTO
--  search_osm(
--  id_link,
--  type_link,
--  region,
--  district,
--  member_role,
--  geom)
--SELECT
--  search2.id_link AS id_link,
--  search2.type_link as type_link,
--  search1.region as region,
--  search2.district AS district,
--  search2.member_role as member_role,
--  search2.geom as geom
--FROM
--	(SELECT
--	  region, 
--	  geom
--	FROM
--	  search_osm
--	WHERE
--	  (region is not null OR region<>'')) as search1
--  INNER JOIN 	(SELECT 
--	  relations.id AS id_link,
--	  'R' as type_link,
--	  coalesce(relations.tags->'name',relations.tags->'place_name') AS district,
--	  relation_members.member_role as member_role,
--	  ((ST_Dump(ST_Polygonize(ways.linestring))).geom) as geom
--	FROM
--	  relations,
--	  relation_members,
--	  ways
--	WHERE
--	  relations.id=relation_members.relation_id
--	  AND relation_members.member_id=ways.id
--	  AND relations.tags->'admin_level' = '6' 
--	  AND relations.tags->'type' = 'boundary' 
--	  AND ways.linestring is not null
--	  AND (coalesce(relations.tags->'name',relations.tags->'place_name')) is not null
--	GROUP BY
--	  id_link,
--	  type_link,
--	  district,
--	  member_role) as search2
--    ON ((search1.geom && search2.geom) AND ST_Covers(search1.geom, search2.geom));  

-- insert city
INSERT INTO
  search_osm(
  addr_type,
  id_link,
  type_link,
  ver_link,
  city,
  member_role,
  geom)
SELECT 
  'city' as addr_type,
  relations.id AS id_link,
  'R' as type_link,
  relations.version as ver_link,
  coalesce(relations.tags->'name',relations.tags->'place_name') AS city,
  relation_members.member_role as member_role,
  ((ST_Dump(ST_Polygonize(ways.linestring))).geom) as geom
FROM
  relations,
  relation_members,
  ways
WHERE
  relations.id=relation_members.relation_id
  AND relation_members.member_id=ways.id
  AND (relations.tags->'place'='town' OR relations.tags->'place'='city') 
  AND ways.linestring is not null
GROUP BY
  id_link,
  type_link,
  ver_link,
  city,
  member_role;

INSERT INTO
  search_osm(
  addr_type,
  id_link,
  type_link,
  ver_link,
  city,
  geom)
SELECT 
  'city' as addr_type,
  ways.id AS id_link,
  'W' as type_link,
  ways.version as ver_link,
  coalesce(ways.tags->'name',ways.tags->'place_name') AS city,
  ((ST_Dump(ST_Polygonize(ways.linestring))).geom) as geom
FROM
  ways
WHERE
  (ways.tags->'place'='town' OR ways.tags->'place'='city') 
  AND ways.linestring is not null
  AND (coalesce(ways.tags->'name',ways.tags->'place_name')) is not null
GROUP BY
  id_link,
  type_link,
  ver_link,
  city;

INSERT INTO
  search_osm(
  addr_type,
  id_link,
  type_link,
  ver_link,
  city,
  geom)
SELECT 
  'city' as addr_type,
  nodes.id AS id_link,
  'N' as type_link,
  nodes.version as ver_link,
  coalesce(nodes.tags->'name',nodes.tags->'place_name') AS city,
  nodes.geom as geom
FROM
  nodes
WHERE
  (nodes.tags->'place'='town' OR nodes.tags->'place'='city')
  AND (coalesce(nodes.tags->'name',nodes.tags->'place_name')) is not null;

-- insert village
INSERT INTO
  search_osm(
  addr_type,
  id_link,
  type_link,
  ver_link,
  village,
  member_role,
  geom)
SELECT 
  'village' as addr_type,
  relations.id AS id_link,
  'R' as type_link,
  relations.version as ver_link,
  coalesce(relations.tags->'name',relations.tags->'place_name') AS village,
  relation_members.member_role as member_role,
  ((ST_Dump(ST_Polygonize(ways.linestring))).geom) as geom
FROM
  relations,
  relation_members,
  ways
WHERE
  relations.id=relation_members.relation_id
  AND relation_members.member_id=ways.id
  AND (relations.tags->'place'='village' OR relations.tags->'place'='hamlet') 
  AND ways.linestring is not null
GROUP BY
  id_link,
  type_link,
  ver_link,
  village,
  member_role;

INSERT INTO
  search_osm(
  addr_type,
  id_link,
  type_link,
  ver_link,
  village,
  geom)
SELECT 
  'village' as addr_type,
  ways.id AS id_link,
  'W' as type_link,
  ways.version as ver_link,
  coalesce(ways.tags->'name',ways.tags->'place_name') AS village,
  ((ST_Dump(ST_Polygonize(ways.linestring))).geom) as geom
FROM
  ways
WHERE
  (ways.tags->'place'='village' OR ways.tags->'place'='hamlet') 
  AND ways.linestring is not null
  AND (coalesce(ways.tags->'name',ways.tags->'place_name')) is not null
GROUP BY
  id_link,
  type_link,
  ver_link,
  village;

INSERT INTO
  search_osm(
  addr_type,
  id_link,
  type_link,
  ver_link,
  village,
  geom)
SELECT 
  'village' as addr_type,
  nodes.id AS id_link,
  'N' as type_link,
  nodes.version as ver_link,
  coalesce(nodes.tags->'name',nodes.tags->'place_name') AS village,
  nodes.geom as geom
FROM
  nodes
WHERE
  (nodes.tags->'place'='village' OR nodes.tags->'place'='hamlet')
  AND (coalesce(nodes.tags->'name',nodes.tags->'place_name')) is not null;


-- insert street
INSERT INTO
  search_osm(
  addr_type,
  id_link,
  type_link,
  ver_link,
  street,
  geom)
SELECT 
  'street' as addr_type,
  ways.id AS id_link,
  'W' as type_link,
  ways.version as ver_link,
  ways.tags->'name' AS street,
  ways.linestring as geom
FROM
  ways
WHERE
  (ways.tags->'highway'='primary' OR ways.tags->'highway'='secondary' OR ways.tags->'highway'='tertiary'
     OR ways.tags->'highway'='unclassified' OR ways.tags->'highway'='residential') 
  AND ways.linestring is not null
  AND (ways.tags->'name') is not null;


-- insert housenumber
INSERT INTO
  search_osm(
  addr_type,
  id_link,
  type_link,
  ver_link,
  street,
  housenumber,
  geom)
SELECT 
  'housenumber' as addr_type,
  ways.id AS id_link,
  'W' as type_link,
  ways.version as ver_link,
  ways.tags->'addr:street' AS street,
  ways.tags->'addr:housenumber' AS housenumber,
  ways.linestring as geom
FROM
  ways
WHERE
  ways.tags ? 'building'  
  AND ways.linestring is not null
  AND ((ways.tags->'addr:housenumber') is not null OR (ways.tags->'addr:housenumber')<>'');

INSERT INTO
  search_osm(
  addr_type,
  id_link,
  type_link,
  ver_link,
  street,
  housenumber,
  geom)
SELECT 
  'housenumber' as addr_type,
  ways.id AS id_link,
  'W' as type_link,
  ways.version as ver_link,
  ways.tags->'addr:street2' AS street,
  ways.tags->'addr:housenumber2' AS housenumber,
  ways.linestring as geom
FROM
  ways
WHERE
  ways.tags ? 'building'  
  AND ways.linestring is not null
  AND ((ways.tags->'addr:housenumber2') is not null OR (ways.tags->'addr:housenumber2')<>'');

INSERT INTO
  search_osm(
  addr_type,
  id_link,
  type_link,
  ver_link,
  street,
  housenumber,
  geom)
SELECT 
  'housenumber' as addr_type,
  ways.id AS id_link,
  'W' as type_link,
  ways.version as ver_link,
  ways.tags->'addr:street3' AS street,
  ways.tags->'addr:housenumber3' AS housenumber,
  ways.linestring as geom
FROM
  ways
WHERE
  ways.tags ? 'building'  
  AND ways.linestring is not null
  AND ((ways.tags->'addr:housenumber3') is not null OR (ways.tags->'addr:housenumber3')<>'');

INSERT INTO
  search_osm(
  addr_type,
  id_link,
  type_link,
  ver_link,
  street,
  housenumber,
  geom)
SELECT 
  'housenumber' as addr_type,
  nodes.id AS id_link,
  'N' as type_link,
  nodes.version as ver_link,
  nodes.tags->'addr:street' AS street,
  nodes.tags->'addr:housenumber' AS housenumber,
  nodes.geom as geom
FROM
  nodes
WHERE
  --ways.tags ? 'building'  
  nodes.geom is not null
  AND ((nodes.tags->'addr:housenumber') is not null OR (nodes.tags->'addr:housenumber')<>'');