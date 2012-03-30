create table wpc_img (
  page text not null unique,
  "desc" text not null default '',
  point geometry,
  date timestamp with time zone not null
);
create table wpc_req (
  page text not null unique,
  added timestamp with time zone
);
create table wpc_done (
  page text not null,
  "desc" text not null default '',
  lat float,
  lon float,
  done timestamp with time zone
);

-- Description of FIRST aggregate function:
CREATE OR REPLACE FUNCTION public.first_agg ( anyelement, anyelement )
RETURNS anyelement AS $$
        SELECT $1;
$$ LANGUAGE SQL IMMUTABLE STRICT;
CREATE AGGREGATE public.first (
        sfunc    = public.first_agg,
        basetype = anyelement,
        stype    = anyelement
);

CREATE OR REPLACE FUNCTION wpc_upsert(_page text, _desc text, _point geometry, _date timestamp with time zone) RETURNS VOID AS $$
BEGIN
  INSERT INTO wpc_img (page, "desc", point, date) VALUES(_page,_desc,_point,_date);
EXCEPTION WHEN unique_violation THEN
  UPDATE wpc_img SET "desc"=_desc,point=_point,date=_date WHERE page=_page AND _date>date;
END;
$$ LANGUAGE plpgsql;
