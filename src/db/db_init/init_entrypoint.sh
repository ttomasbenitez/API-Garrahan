#!/bin/bash
set -euo pipefail

echo "Esperando a que Oracle esté listo..."

CONN_STR="${ORACLE_ADMIN}/${ORACLE_PASSWORD}@//${ORACLE_HOST}:${ORACLE_PORT}/${ORACLE_SERVICE}"

# Espera hasta que Oracle acepte conexiones usando sqlplus
until echo "exit" | sqlplus -L "${ORACLE_ADMIN}/${ORACLE_PASSWORD}@${ORACLE_HOST}:${ORACLE_PORT}/${ORACLE_CDB}" > /dev/null 2>&1; do
  echo "Esperando a Oracle..."
  sleep 10
done

echo "Creando usuario ${ORACLE_APP_USER} y otorgando permisos..."
sqlplus -s "${CONN_STR}" @/init/01_create_app_user.sql "${ORACLE_APP_USER}" "${ORACLE_USER_PASSWORD}" "${ORACLE_SERVICE}"

touch /tmp/init-ok
tail -f /dev/null
