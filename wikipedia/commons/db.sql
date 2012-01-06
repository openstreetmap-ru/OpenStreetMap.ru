create table wpc_img (
  page text not null unique,
  "desc" text not null default '',
  point geometry
);
