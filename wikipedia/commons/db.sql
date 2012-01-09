create table wpc_img (
  page text not null unique,
  "desc" text not null default '',
  point geometry
);
create table wpc_req (
  page text not null unique,
  added timestamp with time zone
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
