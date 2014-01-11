<?php header("HTTP/1.1 500 Internal Server Error"); ?>
<html>
<head>
<title>Ошибка 500: Ошибка сервера</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <div>
    <img src="/img/err500.png" alt="Error 500 Internal Server Error" style="position:relative; left:50%; margin-left:-75px;">
    <div style="font-family:'Helvetica Neue', Arial, Helvetica, sans-serif; font-size:1em; color:gray; text-decoration:none; text-align:center; padding:0em;">
      <p>Ой! У нас тут какая-то ошибка на сервере.<br>Сходите пока на 
        <a href="http://www.openstreetmap.org/">OpenStreetMap.org</a>
      </p>
    </div>
  </div>
</body>
</html>
<?php exit(); ?>
