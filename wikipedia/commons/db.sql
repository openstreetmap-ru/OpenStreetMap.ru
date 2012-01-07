create table wpc_img (
  page text not null unique,
  "desc" text not null default '',
  point geometry
);
create table wpc_req (
  page text not null unique,
  added timestamp with time zone
);
