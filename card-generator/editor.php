<?php
$templateConfig = require __DIR__ . '/../config/card-templates.php';
require_once __DIR__ . '/../includes/functions.php';

$templateId = $_GET['template'] ?? 'work-anniversary';
$template = find_template($templateConfig, $templateId);

if (!$template) {
    http_response_code(404);
    exit('Template not found.');
}

$pageTitle = 'Edit ' . $template['title'];
$data = [];

foreach ($template['fields'] as $field) {
    $data[$field['key']] = in_array($field['key'], ['sub_content', 'wish'], true)
        ? ($field['default'] ?? '')
    : (in_array($field['type'], ['image', 'select'], true) ? ($field['default'] ?? '') : '');
}

$partialPath = __DIR__ . '/template-parts/' . $template['partial'];
require __DIR__ . '/../includes/header.php';
?>

<section class="editor-shell figma-editor">
    <div class="container-fluid">
        <div class="row">
            <div class="col-xl-9">
                <?php require $partialPath; ?>
            </div>

            <div class="col-xl-3">
                <aside class="editor-panel figma-editor-panel">

                    <div class="panel-inner">
                        <a class="btn btn-back mb-3" href="templates.php?category=<?= e($template['category']) ?>">&larr; Back</a>
                        <h1><?= e($template['title']) ?></h1>

                        <form id="cardEditorForm">
                            <?php
                            $anniversaryField = array_filter($template['fields'], static fn (array $field): bool => ($field['key'] ?? '') === 'main_image' && ($field['type'] ?? '') === 'select');
                            $otherFields = array_filter($template['fields'], static fn (array $field): bool => ! (($field['key'] ?? '') === 'main_image' && ($field['type'] ?? '') === 'select'));
                            $editorFields = array_merge($anniversaryField, $otherFields);
                            ?>
                            <?php foreach ($editorFields as $field): ?>
                                <div class="mb-3">
                                    <label class="form-label" for="<?= e($field['key']) ?>"><?= e($field['label']) ?></label>
                                    <?php if ($field['type'] === 'textarea'): ?>
                                        <textarea class="form-control" id="<?= e($field['key']) ?>" name="<?= e($field['key']) ?>" rows="2" placeholder="Enter <?= e(strtolower($field['label'])) ?>" data-editor-field="<?= e($field['key']) ?>"><?= in_array($field['key'], ['sub_content', 'wish'], true) ? e($field['default'] ?? '') : '' ?></textarea>
                                    <?php elseif ($field['type'] === 'select'): ?>
                                        <select class="form-control" id="<?= e($field['key']) ?>" name="<?= e($field['key']) ?>" data-editor-field="<?= e($field['key']) ?>">
                                            <?php foreach ($field['options'] ?? [] as $value => $label): ?>
                                                <option value="<?= e(base_url($value)) ?>" <?= $value === ($field['default'] ?? '') ? 'selected' : '' ?>><?= e($label) ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    <?php elseif ($field['type'] === 'image'): ?>
                                        <input class="form-control" id="<?= e($field['key']) ?>" name="<?= e($field['key']) ?>" type="file" accept="image/*" data-editor-field="<?= e($field['key']) ?>">
                                    <?php else: ?>
                                        <input class="form-control" id="<?= e($field['key']) ?>" name="<?= e($field['key']) ?>" type="text" placeholder="Enter <?= e(strtolower($field['label'])) ?>" data-editor-field="<?= e($field['key']) ?>">
                                    <?php endif; ?>
                                </div>
                            <?php endforeach; ?>

                            <button class="btn btn-primary btn-download w-100" type="button" id="downloadPng">Download PNG</button>
                        </form>
                    </div>
                </aside>
            </div>
        </div>
    </div>
</section>

<div class="modal fade cropper-modal" id="imageCropperModal" tabindex="-1" aria-labelledby="imageCropperTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <div>
                    <span class="cropper-kicker">Image editor</span>
                    <h2 class="modal-title" id="imageCropperTitle">Adjust your photo</h2>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close image editor"></button>
            </div>
            <div class="modal-body">
                <div class="cropper-stage"><img id="cropperImage" alt="Photo ready to crop"></div>
                <p class="cropper-help">Drag to reposition and use the controls to zoom your photo inside the card frame.</p>
            </div>
            <div class="modal-footer gap-1">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="applyCrop">Apply Photo</button>
            </div>
        </div>
    </div>
</div>

<?php require __DIR__ . '/../includes/footer.php'; ?>