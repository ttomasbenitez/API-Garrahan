#!/bin/bash
set -e

echo "Esperando a que Oracle esté listo..."
sleep 30

echo "Creando app_user y otorgando permisos..."
sqlplus -s system/app_pass@oracle:1521/XE @/init/01_create_app_user.sql

touch /tmp/init-ok
tail -f /dev/null