<?php
$pageTitle = 'Choose Card Category';
$templateConfig = require __DIR__ . '/../config/card-templates.php';
require_once __DIR__ . '/../includes/functions.php';
$categories = get_card_categories($templateConfig);
require __DIR__ . '/../includes/header.php';
?>

<section class="section-wrap">
    <div class="container">
        <div class="page-heading">
            <p class="eyebrow">Card Generator</p>
            <h1>Choose a card type</h1>
            <p>Select the event category, choose a template, edit the details, and download the final card.</p>
        </div>

        <div class="row g-4">
            <?php foreach ($categories as $category): ?>
                <div class="col-md-6 col-xl-4">
                    <a class="category-card" href="templates.php?category=<?= e($category['slug']) ?>">
                        <span class="category-icon"><?= strtoupper(substr($category['name'], 0, 1)) ?></span>
                        <span>
                            <strong><?= e($category['name']) ?></strong>
                            <small><?= e($category['description']) ?></small>
                        </span>
                    </a>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php require __DIR__ . '/../includes/footer.php'; ?>
