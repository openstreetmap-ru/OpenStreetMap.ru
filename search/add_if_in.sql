-- update region in all
UPDATE search_osm AS search1 SET region=search2.region
FROM search_osm AS search2
WHERE ((search2.geom && search1.geom) AND ST_Covers(search2.geom, search1.geom))
  AND (search2.region is not null OR search2.region<>'')
  AND (search1.region is null OR search1.region='')
  AND (search1.member_role = 'outer' OR search1.member_role is null OR search1.member_role='')
 -- AND (search1.district is not null OR search1.district <> '')
 ;

-- update district in all
UPDATE search_osm AS search1 SET district=search2.district
FROM search_osm AS search2
WHERE ((search2.geom && search1.geom) AND ST_Covers(search2.geom, search1.geom))
  AND (search2.district is not null OR search2.district<>'')
  AND (search1.district is null OR search1.district='')
  AND (search1.member_role = 'outer' OR search1.member_role is null OR search1.member_role='');

-- update city in all
UPDATE search_osm AS search1 SET city=search2.city
FROM search_osm AS search2
WHERE ((search2.geom && search1.geom) AND ST_Covers(search2.geom, search1.geom))
  AND (search2.city is not null OR search2.city<>'')
  AND (search1.city is null OR search1.city='')
  AND (search1.member_role = 'outer' OR search1.member_role is null OR search1.member_role='');

-- update village in all
UPDATE search_osm AS search1 SET city=search2.village
FROM search_osm AS search2
WHERE ((search2.geom && search1.geom) AND ST_Covers(search2.geom, search1.geom))
  AND (search2.village is not null OR search2.village<>'')
  AND (search1.village is null OR search1.village='')
  AND (search1.member_role = 'outer' OR search1.member_role is null OR search1.member_role='');

-- update street in all
UPDATE search_osm AS search1 SET city=search2.street
FROM search_osm AS search2
WHERE ((search2.geom && search1.geom) AND ST_Covers(search2.geom, search1.geom))
  AND (search2.street is not null OR search2.street<>'')
  AND (search1.street is null OR search1.street='')
  AND (search1.member_role = 'outer' OR search1.member_role is null OR search1.member_role='');

-- update housenumber in all
UPDATE search_osm AS search1 SET city=search2.housenumber
FROM search_osm AS search2
WHERE ((search2.geom && search1.geom) AND ST_Covers(search2.geom, search1.geom))
  AND (search2.housenumber is not null OR search2.housenumber<>'')
  AND (search1.housenumber is null OR search1.housenumber='')
  AND (search1.member_role = 'outer' OR search1.member_role is null OR search1.member_role='');  



-- update region in city
--UPDATE search_osm AS search1 SET region=search2.region
--FROM search_osm AS search2
--WHERE ((search2.geom && search1.geom) AND ST_Covers(search2.geom, search1.geom))
--  AND (search2.region is not null OR search2.region<>'')
--  AND (search1.region is null OR search1.region='')
--  AND (search1.member_role = 'outer' OR search1.member_role is null OR search1.member_role='')
--  AND (search1.city is not null OR search1.city <> '');
