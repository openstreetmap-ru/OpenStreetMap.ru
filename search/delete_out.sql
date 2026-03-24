-- Recommended: Delete and see exactly what was removed
DELETE FROM search_osm s
WHERE id IN (
    SELECT s2.id
    FROM search_osm s2
    WHERE NOT EXISTS (
        SELECT 1
        FROM search_osm r
        WHERE r.addr_type = 'region'
          AND ST_Intersects(r.geom, s2.geom)
    )
)
RETURNING 
    id,
    addr_type,
    district,
    name,
    ST_AsText(geom) AS geom_text;   -- remove this line if you don't need geometry as text
