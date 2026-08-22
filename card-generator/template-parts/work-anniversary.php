<div class="work-card" id="cardPreview">
    <div class="work-copy">
        <img data-preview-image="main_image" src="<?= e(base_url($data['main_image'])) ?>" alt="Work anniversary celebration" />
        <p data-preview-field="sub_content"><?= e($data['sub_content'] ?: 'Your message') ?></p>
    </div>
    <div class="work-person-frame">
        <img data-preview-image="profile_image" src="<?= e(base_url($data['profile_image'])) ?>" alt="Profile image">
        <div class="work-person-meta">
            <img src="<?= e(base_url('assets/images/templates/work-anniversary/user.svg')) ?>" alt="Employee profile" />
            <div class="work-person-details">
                    <h2 data-preview-field="name"><?= e($data['name'] ?: 'Name') ?></h2>
                    <h5 data-preview-field="designation"><?= e($data['designation'] ?: 'Job Title') ?></h5>
                    <div class="d-flex align-items-center gap-1">
                        <img class="calendar-icon" src="<?= e(base_url('assets/images/calendar.svg')) ?>" alt="Calendar icon" />
                        <h6 data-preview-field="date"><?= e($data['date'] ?: 'Date') ?></h6>
                    </div>
            </div>
        </div>
    </div>
</div>
