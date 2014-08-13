<!DOCTYPE html>
<html lang="en"><head>
  <meta charset="utf-8">
  <title><? echo $title ?></title>
    <meta name="description" content="">
    <meta name="author" content="Giang Nguyen">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" >
    <meta name="HandheldFriendly" content="True">
    <meta name="MobileOptimized" content="320">
    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1"/>
    <meta name="robots" content="all" />
    <meta name="google" content="notranslate" />
    
  <?php foreach ($header_css as $item):?>
  <link type=text/css href=<?php echo $item;?> rel=stylesheet>
  <?php endforeach;?>
    <?php foreach ($header_js as $item):?>
  <script type=text/javascript src=<?php echo $item;?>></script>
  <?php endforeach;?>
  <script>
  /* (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-39446785-1', 'giang.is');
  ga('send', 'pageview');
*/
  </script>
</head>
<body>