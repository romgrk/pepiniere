/*
 * schema.sql
 */



CREATE TABLE settings (
    key    varchar(100) primary key,
    value  text         not null
);
INSERT INTO settings VALUES
    ('whitelist',  '["rom7011@gmail.com"]') -- users allowed to login/signup
;

CREATE TABLE members (
    id          integer     primary key autoincrement,
    firstName   text        not null,
    lastName    text        not null,
    country     text        null,
    photo       text        null,
    isPermanent integer     null,
    startDate   integer     null,
    endDate     integer     null
);

CREATE TABLE categories (
    id       integer     primary key autoincrement,
    name     text        not null,
    color    text        not null
);

CREATE TABLE tasks (
    id         integer   primary key autoincrement,
    categoryId integer   not null,
    name       text      not null
);

CREATE TABLE runs (
    id       integer primary key autoincrement,
    taskId   integer not null,
    memberId integer not null,
    date     integer not null,
    isAM     integer default 1,
    notes    text    default ''
);

-- Bootstrap data

INSERT INTO members (firstName, lastName, country, isPermanent, startDate, endDate)
    VALUES ('Eric', 'Delorimier', 'CAN', 1, null, null);
INSERT INTO members (firstName, lastName, country, isPermanent, startDate, endDate)
    VALUES ('Camille', 'F', 'CHE', 1, null, null);
INSERT INTO members (firstName, lastName, country, isPermanent, startDate, endDate)
    VALUES ('Romain', 'Gregoire', 'CAN', 0, date('2020-07-11'), date('2020-07-31'));
INSERT INTO members (firstName, lastName, country, isPermanent, startDate, endDate)
    VALUES ('Claire', 'Hanny', 'CAN', 0, date('2020-07-11'), date('2020-07-19'));

INSERT INTO categories (name, color) VALUES ('Production',   '#3366CC');
INSERT INTO categories (name, color) VALUES ('Construction', '#DC3912');

INSERT INTO tasks (categoryId, name) VALUES (1, 'Seed Collecting');
INSERT INTO tasks (categoryId, name) VALUES (1, 'Planting');
INSERT INTO tasks (categoryId, name) VALUES (1, 'Weeding');



/* INSERT INTO users (id, "googleID", token, name, email, password) VALUES (
 *     nextval('users_id_seq'),
 *     null,
 *     null,
 *     'System',
 *     null,
 *     'Gr4nts'
 * ); */


-- Test data

/* INSERT INTO users (id, "googleID", token, name, email) VALUES (
 *     nextval('users_id_seq'),
 *     '113897916442927912291',
 *     'ya2GlsZBV75c-JxuuzblrbS7WoUmuWpJDJtgOOdzUcwFOaFt_7ADAIRKpiOXA1A_TtFl1AkMoXAPcqus6_ia',
 *     'Rom Grk',
 *     'rom7011@gmail.com'
 * ); */

-- vim:et
