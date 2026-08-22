# Ditstek Cards

A PHP + Bootstrap dynamic card generator for birthdays, work anniversaries,
wedding anniversaries, and other company celebration cards.

## What is included

- Category gallery
- Template gallery
- Live card editor
- Editable text fields
- Profile image upload preview
- PNG download using `html2canvas`
- Config-driven templates in PHP

## Run locally

From the project root:

```bash
php -S localhost:8000
```

Then open:

```text
http://localhost:8000/
```

## Add a New Template

1. Add the preview/background image under `assets/images/templates/{category}/`.
2. Add a new template entry in `config/card-templates.php`.
3. Create a matching partial in `card-generator/template-parts/`.

The editor fields are generated from the `fields` array inside the config file.
