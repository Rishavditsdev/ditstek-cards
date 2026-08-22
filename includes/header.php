<?php require_once __DIR__ . '/functions.php'; ?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= e($pageTitle ?? 'Ditstek Cards') ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Caramel&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/cropperjs@1.6.2/dist/cropper.min.css" rel="stylesheet">
    <link href="<?= e(base_url('assets/css/style.css')) ?>" rel="stylesheet">
</head>
<body>
<nav class="navbar navbar-expand-lg app-navbar">
    <div class="container">
        <a class="navbar-brand" href="<?= e(base_url('card-generator/index.php')) ?>"><img src="<?= e(base_url('assets/images/logo.svg')) ?>" alt="Ditstek Cards"></a>
    </div>
</nav>
<main>
