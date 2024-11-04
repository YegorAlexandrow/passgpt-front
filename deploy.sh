#!/bin/bash

# Инициализация переменных
HOSTING=""

# Парсинг аргументов
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    --hosting)
    HOSTING="$2"
    shift # пропускаем аргумент
    shift # пропускаем значение
    ;;
    --hosting=*)
    HOSTING="${key#*=}"
    shift # пропускаем аргумент=значение
    ;;
    *)
    # неизвестная опция
    shift
    ;;
esac
done

if [ -z "$HOSTING" ]; then
    echo "Пожалуйста, укажите тип хостинга через аргумент --hosting (app или landing)"
    exit 1
fi

# Устанавливаем переменные на основе типа хостинга
if [ "$HOSTING" == "app" ]; then
    export AIP_INDEX_PAGE=chat
    DEPLOY_PATH="/www/ask.wowgpt.ru"
elif [ "$HOSTING" == "landing" ]; then
    DEPLOY_PATH="/www/wowgpt.ru"
else
    echo "Неизвестный тип хостинга: $HOSTING"
    exit 1
fi

# Собираем приложение с помощью npm
npm run build

# Проверяем успешность сборки
if [ $? -ne 0 ]; then
    echo "Сборка не удалась"
    exit 1
fi

# Получаем адрес и пароль из переменных окружения с префиксом AIP_
if [ -z "$AIP_HOST_ADDRESS" ] || [ -z "$AIP_HOST_PASSWORD" ]; then
    echo "Пожалуйста, установите переменные окружения AIP_HOST_ADDRESS и AIP_HOST_PASSWORD"
    exit 1
fi

# Проверяем наличие lftp
if ! command -v lftp &> /dev/null
then
    echo "lftp не найден, пожалуйста, установите его для продолжения"
    exit 1
fi

# Разделяем AIP_HOST_ADDRESS на HOST_USERNAME и HOST_HOSTNAME
if [[ "$AIP_HOST_ADDRESS" == *"@"* ]]; then
    HOST_USERNAME="${AIP_HOST_ADDRESS%@*}"
    HOST_HOSTNAME="${AIP_HOST_ADDRESS#*@}"
else
    echo "AIP_HOST_ADDRESS должен быть в формате user@hostname"
    exit 1
fi

# Загружаем файлы через lftp с использованием ftp
echo "Загружаем на $HOST_HOSTNAME:$DEPLOY_PATH через ftp"

lftp -u "$HOST_USERNAME","$AIP_HOST_PASSWORD" "$HOST_HOSTNAME" <<EOF
set ftp:ssl-allow no
mirror -R dist/spa/ $DEPLOY_PATH
bye
EOF

if [ $? -ne 0 ]; then
    echo "Не удалось загрузить файлы"
    exit 1
fi

echo "Деплой успешно завершен"
