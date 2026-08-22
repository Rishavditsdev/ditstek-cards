<?php

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function base_url(string $path = ''): string
{
    $base = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
    $base = str_replace('/card-generator', '', $base);

    return ($base === '' ? '' : $base) . '/' . ltrim($path, '/');
}

function get_card_categories(array $templates): array
{
    return $templates['categories'] ?? [];
}

function get_templates_by_category(array $templates, string $categorySlug): array
{
    return array_values(array_filter($templates['templates'] ?? [], function ($template) use ($categorySlug) {
        return ($template['category'] ?? '') === $categorySlug;
    }));
}

function find_template(array $templates, string $templateId): ?array
{
    foreach ($templates['templates'] ?? [] as $template) {
        if (($template['id'] ?? '') === $templateId) {
            return $template;
        }
    }

    return null;
}
