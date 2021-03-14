/*
 * migration-001.sql
 * Copyright (C) 2021 romgrk <romgrk@arch>
 *
 * Distributed under terms of the MIT license.
 */

alter table settings rename column key id;

alter table settings add column createdAt integer null;
alter table settings add column updatedAt integer null;
alter table settings add column deleted integer default 0;
alter table members add column createdAt integer null;
alter table members add column updatedAt integer null;
alter table members add column deleted integer default 0;
alter table categories add column createdAt integer null;
alter table categories add column updatedAt integer null;
alter table categories add column deleted integer default 0;
alter table tasks add column createdAt integer null;
alter table tasks add column updatedAt integer null;
alter table tasks add column deleted integer default 0;
alter table runs add column createdAt integer null;
alter table runs add column updatedAt integer null;
alter table runs add column deleted integer default 0;

update settings set createdAt = strftime('%s', current_timestamp);
update settings set updatedAt = strftime('%s', current_timestamp);
update members set createdAt = strftime('%s', current_timestamp);
update members set createdAt = strftime('%s', current_timestamp);
update categories set createdAt = strftime('%s', current_timestamp);
update categories set createdAt = strftime('%s', current_timestamp);
update tasks set updatedAt = strftime('%s', current_timestamp);
update tasks set updatedAt = strftime('%s', current_timestamp);
update runs set updatedAt = strftime('%s', current_timestamp);
update runs set updatedAt = strftime('%s', current_timestamp);


-- vim:et
