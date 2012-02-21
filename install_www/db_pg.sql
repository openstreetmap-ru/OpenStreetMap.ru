

CREATE TABLE pagedata
(
  id serial NOT NULL,
  "name" text,
  "text" text,
  color character(32),
  "level" integer,
  activate boolean NOT NULL DEFAULT false,
  "order" integer NOT NULL DEFAULT 0,
  CONSTRAINT pk_pagedata PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);


INSERT INTO "pagedata" ("name", "text", "color", "level", "activate", "order") VALUES
	( 'map', 'Карта', '#99bd1b', 0, true, 1),
	( 'cakes', 'Плюшки', '#f9ba1c', 0, true, 2),
	( 'about', 'О проекте', '#fad051', 0, true, 3),
	( 'contribute', 'Участвовать', '#c3102e', 0, false, 0),
	( 'news', 'Новости', '#db4c39', 0, false, 0),
	( 'diaries', 'Дняффки', '#faaa87', 0, false, 0),
	( 'login', 'Вход', '#4a8af5', 0, false, 0);
