#!/bin/bash
set -e

echo "Esperando a que Oracle esté listo..."

# Espera hasta que Oracle acepte conexiones usando sqlplus
until echo "exit" | sqlplus -L "system/oracle@oracle:1521/XE" > /dev/null 2>&1; do
  echo "Esperando a Oracle..."
  sleep 10
done

echo "Creando app_user y otorgando permisos..."
sqlplus -s system/oracle@//oracle:1521/XEPDB1 @/init/01_create_app_user.sql

touch /tmp/init-ok
tail -f /dev/null