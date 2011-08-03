UPDATE search_osm AS search1 SET full_name=search2.region || search2.district || 
		search2.city || search2.village || search2.street || search2.housenumber

FROM
	(SELECT 
	  id, 
	  id_link, 
	  type_link,
	  full_name, 
	  CASE WHEN((region is null) OR (region='')) THEN '' ELSE
	    CASE WHEN addr_type='region' THEN region ELSE region || ', ' END END as region, 
	  CASE WHEN((district is null) OR (district='')) THEN '' ELSE
	    CASE WHEN addr_type='district' THEN district ELSE district || ', ' END END as district, 
	  CASE WHEN((city is null) OR (city='')) THEN '' ELSE
	    CASE WHEN addr_type='city' THEN city ELSE city || ', ' END END as city, 
	  CASE WHEN((village is null) OR (village='')) THEN '' ELSE
	    CASE WHEN addr_type='village' THEN village ELSE village || ', ' END END as village, 
	  CASE WHEN((street is null) OR (street='')) THEN '' ELSE
	    CASE WHEN addr_type='street' THEN street ELSE  street || ', ' END END as street, 
	  CASE WHEN((housenumber is null) OR (housenumber='')) THEN '' ELSE housenumber END as housenumber, 
	  addr_type
	FROM search_osm) as search2

WHERE
  search1.id=search2.id
  AND ((search2.full_name='') OR (search2.full_name is null))
;
