/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     10/06/2025 09:33:38 a. m.                    */
/*==============================================================*/


drop table if exists ANIMAL;

/*==============================================================*/
/* Table: ANIMAL                                                */
/*==============================================================*/
create table ANIMAL
(
   ID_ANIMAL            int not null,
   NOMBRE_ANIMAL        varchar(100) not null,
   ESPECIE_ANIMAL       varchar(100) not null,
   primary key (ID_ANIMAL)
);

