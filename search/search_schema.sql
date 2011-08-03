-- pgsql_simple_schema_0.6

DROP TABLE IF EXISTS search_osm;

CREATE TABLE search_osm
(
  id bigserial NOT NULL,
  id_link bigint NOT NULL,
  type_link character(1) NOT NULL,
  ver_link integer,
  full_name text,
  region text,
  district text,
  city text,
  village text,
  street text,
  housenumber text,
  member_role text,
  addr_type text,
  CONSTRAINT id PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE search_osm OWNER TO postgres;
COMMENT ON TABLE search_osm IS 'type_link: N-nodes,W-ways,R-relations';

SELECT AddGeometryColumn('search_osm','geom', 4326, 'GEOMETRY', 2);

SELECT AddGeometryColumn('search_osm','c_geom', 4326, 'POINT', 2);
