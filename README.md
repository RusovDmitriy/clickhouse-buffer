# ClickHouse-Buffer

Redis buffer for streaming data to ClickHouse writen on Node.js

## Requirements

- Node >= 10.16.3
- Git
- Redis
- ClickHouse

## Common setup

Clone the repo and install the dependencies.

```bash
git clone https://github.com/RusovDmitriy/clickhouse-buffer
cd clickhouse-buffer

npm install
```

```bash
# Start api (http cluster) + loader (worker_thread)
npm run start

# Also you can start processes separately
# Start api (http single)
npm run http
# Start loader
npm run loader
```

## Config

For settings buffer use environment variables:

| Name               | Default        | Description                                                                                                               |
| ------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| HTTP_PORT          | 3000           | Port for API (http server)                                                                                                |
| REDIS_HOST         | 127.0.0.1      | Host for redis instance                                                                                                   |
| REDIS_PORT         | 6379           | Port for redis instance                                                                                                   |
| CLICKHOUSE_SERVERS | 127.0.0.1:8123 | List of clickhouse servers HOST:PORT, separated by comma                                                                  |
| TABLES             | default.test   | List of clickhouse tables name DB_NAME.TABLE_NAME, separated by comma. A separate thread for each table will be launched. |

## Use Docker

You can also run this app as a Docker container:

Step 1: Clone the repo

```bash
git clone https://github.com/RusovDmitriy/clickhouse-buffer
cd clickhouse-buffer
```

Step 2: Build the Docker image

```bash
docker build -t clickhouse-buffer .
```

Step 3: Run the Docker container locally:

```bash
docker run -it --rm -p 3000:3000 \
  -e TABLES=default.test \
  -e CLICKHOUSE_SERVERS=127.0.0.1:8123 \
  -e REDIS_HOST=127.0.0.1 \
  -e REDIS_PORT=6379 \
  clickhouse-buffer
```

## Write data to buffer

All you need to do is send a post request with the data to be inserted in a simple JSON format:

```bahs
curl -X POST -d '<json>' http://localhost:3000
```

```json
{
  "table": "tracker.hits",
  "values": [
    {
      "date": "2019-01-01",
      "time": "2019-01-01 00:00:01",
      "url": "http://test.com"
    },
    {
      "date": "2019-01-01",
      "time": "2019-01-01 00:00:02",
      "url": "http://test.com/page1"
    }
  ]
}
```

For this example loader create insert query like:

```sql
INSERT INTO tracker.hits(date, time, url) FORMAT TabSeparated

2019-01-01\t2019-01-01 00:00:01\thttp://test.com\n
2019-01-01\t2019-01-01 00:00:02\thttp://test.com/page1\n
```

If the fields of the inserted data are changed, the buffer will generate a new insert request each time the fields are changed. For better performance, you must insert objects with the same property sets.
