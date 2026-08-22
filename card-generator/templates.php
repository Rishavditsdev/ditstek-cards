<?php
$templateConfig = require __DIR__ . '/../config/card-templates.php';
require_once __DIR__ . '/../includes/functions.php';

$categorySlug = $_GET['category'] ?? 'work-anniversary';
$categories = get_card_categories($templateConfig);
$category = null;

foreach ($categories as $item) {
    if ($item['slug'] === $categorySlug) {
        $category = $item;
        break;
    }
}

$templateList = get_templates_by_category($templateConfig, $categorySlug);
$pageTitle = ($category['name'] ?? 'Templates') . ' Templates';
require __DIR__ . '/../includes/header.php';
?>

<section class="section-wrap">
    <div class="container">
        <a class="btn btn-secondary" href="index.php">&larr; Back to categories</a>
        <div class="page-heading">
            <p class="eyebrow mt-4">Templates</p>
            <h1><?= e($category['name'] ?? 'Card Templates') ?></h1>
            <p class="mt-1"><?= e($category['description'] ?? 'Choose a template to start editing.') ?></p>
        </div>

        <?php if (empty($templateList)): ?>
            <div class="empty-state">No templates found for this category yet.</div>
        <?php endif; ?>

        <div class="row g-4">
            <?php foreach ($templateList as $template): ?>
                <div class="col-md-6 col-xl-4">
                    <div class="template-card">
                        <div class="template-card-preview">
                            <img src="<?= e(base_url($template['preview'])) ?>" alt="<?= e($template['title']) ?> preview">
                        </div>
                        <div class="template-card-body">
                            <h2><?= e($template['title']) ?></h2>
                            <p class="template-card-description"><?= e($template['description'] ?? 'A thoughtfully designed card ready for your personal message.') ?></p>
                            <div>
                                <a class="btn btn-primary" href="editor.php?template=<?= e($template['id']) ?>">Use Template <span aria-hidden="true">&rarr;</span></a>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php require __DIR__ . '/../includes/footer.php'; ?>