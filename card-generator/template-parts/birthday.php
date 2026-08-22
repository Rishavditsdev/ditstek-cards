<div class="birthday-card" id="cardPreview">
    <div class="person-frame">
        <img data-preview-image="main_image" src="<?= e(base_url($data['main_image'])) ?>" alt="Profile image">
    </div>
    <div class="card-copy">
        <h2 data-preview-field="name"><?= e($data['name'] ?: 'Name') ?></h2>
        <h6 data-preview-field="date"><?= e($data['date'] ?: 'Date') ?></h6>
    </div>
</div>