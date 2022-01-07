# NocoDB

## Development

```shell

# setup env vars
cp .env-sample .env

# Run MySQL and NocoDB with docker-compose
docker-compose up
```

## Database Migrations

```shell
# Check migration status
./scripts/migrate.sh status

# Create new migration
./scripts/migrate.sh create [name] sql

# Apply migrations
./scripts/migrate.sh up
```
