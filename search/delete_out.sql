DELETE FROM search_osm
WHERE
  id IN
	(SELECT
	--  search3.id_link,
	--  search3.type_link,
	--  search3.district,
	  search3.id
	FROM
		(SELECT
		  search2.id,
		  search2.id_link,
		  search2.type_link,
		  search2.district,
		--  search1.region,
		  bool_and(ST_Disjoint(search1.geom, search2.geom)) as ifdelete
		FROM
		  search_osm as search1,
		  search_osm AS search2
		WHERE
		  search1.addr_type='region'
	--	  AND search2.addr_type='district'
		GROUP BY
		  search2.id,
		  search2.id_link,
		  search2.type_link,
		  search2.district) as search3
	WHERE
	  search3.ifdelete)

--RETURNING *

;
