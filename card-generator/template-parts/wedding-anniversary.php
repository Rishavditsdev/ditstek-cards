<div class="wedding-card" id="cardPreview">
    <div class="card-copy">
        <h2>
            <span data-preview-field="male_name"><?= e($data['male_name'] ?: 'Male Name') ?></span>
            <span class="sr-only" aria-hidden="true"> &amp; </span>
            <span data-preview-field="female_name"><?= e($data['female_name'] ?: 'Female Name') ?></span>
        </h2>
        <div class="frames-container">
            <img class="frames" src="<?= e(base_url('assets/images/templates/wedding-anniversary/frame-up.svg')) ?>" alt="Couple image" />
            <?php
            $dateParts = preg_split('/\s+/', trim($data['date'] ?: 'Date'), 2);
            $dateDay = $dateParts[0] ?? 'Date';
            $dateMonth = $dateParts[1] ?? '';
            ?>
            <small class="date" data-preview-date>
                <strong data-preview-date-day><?= e($dateDay) ?></strong>
                <span data-preview-date-month><?= e($dateMonth) ?></span>
            </small>
            <img class="frames" src="<?= e(base_url('assets/images/templates/wedding-anniversary/frame.svg')) ?>" alt="Couple image" />
        </div>
        <p data-preview-field="wish" class="wish"><?= e($data['wish'] ?: 'Your anniversary message') ?></p>
    </div>
    <div class="person-frame">
        <img data-preview-image="profile_image" src="<?= e(base_url($data['profile_image'] ?? 'assets/images/default-user.svg')) ?>" alt="Couple image">
    </div>
</div>
