create user resume_user noinherit password 'resume_password' if not exists;
alter user resume_user set search_path = resume;
grant connect,create on database resume to experience_user;
create schema if not exists resume
alter schema resume owner to resume_user;
