# 15_sprint

Проектная работа 15

84.201.186.75 Публичный IP 

max-mesto.ml Cсылка на страницу

Ссылка на страницу через публичный IP http://84.201.186.75

Последний рывок. Доделаем бэкенд проекта Mesto и задеплоим его.
1. Реализуйте централизованную обработку ошибок
Создайте мидлвэр для централизованной обработки ошибок. В местах возникновения ошибок больше не возвращайте их, а передавайте обработку в этот мидлвэр.
Проследите за тем, что API больше не возвращает объект ошибки в том виде, в котором он возник. Например, такого быть не должно:
.catch(err => res.send(err))
В случае, если на сервере возникает ошибка, которую мы не предусмотрели, возвращайте ошибку 500.
2. Валидируйте запросы
Тела запросов к серверу должны валидироваться до передачи обработки в контроллеры. Если запрос принимает какую-то информацию в заголовках или параметрах, валидируйте и её.
API должен возвращать ошибку, если запрос не соответствует схеме, которую мы определили.
3. Реализуйте логгирование запросов и ошибок
Каждый запрос к API должен сохраняться в файле request.log. Если API возвращает ошибку, информация о ней должна сохраняться в файле error.log.
Сохраняйте логи в формате JSON и не добавляйте файлы логов в репозиторий.
4. Создайте облачный сервер и разверните API
Создайте сервер, установите всё необходимое и разверните на нём API.
Критерий готовности этого пункта такой: обратиться к API должно быть можно по публичному IP-адресу сервера. Вся функциональность при этом должна сохраниться.
Для создания облачного сервера мы рекомендуем использовать платформу Яндекс Облако, так как она предоставляет грант для новых пользователей. Если вы пользовались Яндекс Облаком раньше и уже израсходовали входной грант, обратитесь к комьюнити-менеджеру.
5. Создайте домен и прикрепите его к серверу
Зарегистрируйте домен и сделайте так, чтобы он указывал на публичный IP вашего сервера. Для наших целей подойдёт и бесплатный домен.
Критерий готовности: к API можно обратиться по доменному имени. Вся функциональность сохранена.
6. Выпустите сертификаты и подключите их
У клиента должна быть возможность обратиться к серверу по https.
7. env переменные
Создайте на сервере .env файл и добавьте туда переменные окружения. Из обязательных:
NODE_ENV=production;
JWT_SECRET с секретным ключом для создания и верификации JWT.
.env файл должен быть только на сервере, не храните его в репозитории. В режиме разработки (когда process.env.NODE_ENV !== 'production') код должен запускаться и работать без наличия этого файла.
Вспомнить, что такое .env файл и как с ним работать, поможет пятый урок темы «Безопасность веб-приложения».
8. Краш-тест сервера
Ситуации, в которых сервер падает должны быть предусмотрены. Приложение должно работать в процессе, который в случае падения автоматически восстанавливается. Сделать это поможет pm2.
Чтобы на ревью мы смогли наверняка это протестировать, перед обработчиками роутов /signin и /signup добавьте такой код:
app.get('/crash-test', () => {
    setTimeout(() => {
        throw new Error('Сервер сейчас упадёт');
    }, 0);
});
Необработанная ошибка в Node.js вызывает событие uncaughtException. При возникновения этого события процесс, в котором работает Node.js, завершается. Поэтому теперь, при GET-запросе на URL /crash-test сервер будет падать. pm2 должен его восстанавливать. После GET-запроса на /crash-test должна быть возможность обратиться по любому другому роуту, не запуская приложение на сервере вручную.
Не забудьте удалить этот код после успешного прохождения ревью.
9. Расскажите как найти ваш сервер
Добавьте публичный IP-адрес сервера и домен, по которому к нему можно обратиться, в файл README.md.
Проверьте проект по чеклисту
все ошибки обрабатываются централизованно;
тела запросов и, где необходимо, заголовки и параметры, валидируются по определённым схемам. Если запрос не соответствует схеме, обработка не передаётся контроллеру и клиент получает ошибку валидации;
все запросы и ответы записываются в файл request.log;
все ошибки записываются в файл error.log;
файлы логов не добавляются в репозиторий;
к серверу можно обратиться по публичному IP-адресу, указанному в README.md;
к серверу можно обратиться по http и по https, используя домен, указанный в README.md;
секретный ключ для создания и верификации JWT хранится на сервере в .env файле. Этот файл не добавляется в git;
в режиме разработки (когда process.env.NODE_ENV !== 'production') код запускается и работает без наличия .env файла;
сервер самостоятельно восстанавливается после GET-запроса на URL /crash-test
