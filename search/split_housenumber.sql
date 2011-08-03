INSERT INTO search_osm (id_link, type_link, full_name, region, district, city, village, 
       member_role, geom, street, housenumber, addr_type)
SELECT id_link, type_link, full_name, region, district, city, village, 
       member_role, geom, street,  
       regexp_split_to_table(housenumber, E',') as housenumber,
       addr_type
FROM search_osm
WHERE
  addr_type='housenumber'
  AND housenumber LIKE '%,%';
