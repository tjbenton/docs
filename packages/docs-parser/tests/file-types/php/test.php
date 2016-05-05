<?php
  ////
  /// @name PHP
  /// @author Tyler Benton
  /// @page tests/php-file
  ////


  /// @name One
  /// @description
  /// main method
  echo 'This is saying something';

  /// @name Two
  /// @description
  /// This is a normal multi-line comment.
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "example.com");

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    $output = curl_exec($ch);

    curl_close($ch);

  /// @name Three
  /// @description
  /// This is another normal multi-line comment.
  $color = "red";
  echo "My car is " . $color . "<br>";
  echo "My house is " . $COLOR . "<br>";
  echo "My boat is " . $coLOR . "<br>";

  // This is a normal single-line comment.
?>
