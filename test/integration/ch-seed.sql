CREATE DATABASE IF NOT EXISTS chbuffer;

CREATE TABLE IF NOT EXISTS chbuffer.test (
  date Date,
  time DateTime,
  uid String,
  url String,
  count UInt32)
  ENGINE = MergeTree()
  ORDER BY (date, uid)
  SAMPLE BY uid;

CREATE TABLE IF NOT EXISTS chbuffer.test2 (
  date Date,
  time DateTime,
  uid String,
  url String,
  count UInt32)
  ENGINE = MergeTree()
  ORDER BY (date, uid)
  SAMPLE BY uid;
