<?php

return [
    'categories' => [
        [
            'name' => 'Birthdays',
            'slug' => 'birthday',
            'description' => 'Thoughtful birthday cards for celebrating people across your organisation.',
        ],
        [
            'name' => 'Work Anniversaries',
            'slug' => 'work-anniversary',
            'description' => 'Recognise dedication, growth, and the milestones that shape every career journey.',
        ],
        [
            'name' => 'Wedding Anniversaries',
            'slug' => 'wedding-anniversary',
            'description' => 'Elegant anniversary greetings for celebrating lasting partnership and togetherness.',
        ],
    ],
    'templates' => [
        [
            'id' => 'work-anniversary',
            'title' => 'Work Anniversary',
            'category' => 'work-anniversary',
            'description' => 'A polished way to recognise dedication, growth, and another meaningful year with the team.',
            'preview' => 'assets/images/templates/work-anniversary/work-anniversary.svg',
            'partial' => 'work-anniversary.php',
            'fields' => [
                ['key' => 'sub_content', 'label' => 'Message', 'type' => 'textarea', 'default' => 'Congratulations on completing 1 year with us. As a graphic designer, you have brought creativity and a fresh visual perspective to your work. Your approach reflects a good sense of design and attention to detail, adding value to the overall output. Over this time, you have shown a willingness to learn and refine your skills with consistency. Your contributions continue to shape the visual identity in meaningful ways. We truly appreciate your efforts and look forward to your continued growth and many more creative milestones ahead.'],
                ['key' => 'name', 'label' => 'Name', 'type' => 'text', 'default' => 'AKASH KUMAR'],
                ['key' => 'designation', 'label' => 'Job Title', 'type' => 'text', 'default' => 'Graphic Designer'],
                ['key' => 'date', 'label' => 'Date', 'type' => 'text', 'default' => '2nd May'],
                [
                    'key' => 'main_image',
                    'label' => 'Anniversary Year',
                    'type' => 'select',
                    'default' => 'assets/images/templates/work-anniversary/first-work-anniversary.svg',
                    'options' => [
                        'assets/images/templates/work-anniversary/first-work-anniversary.svg' => '1st Work Anniversary',
                        'assets/images/templates/work-anniversary/second-work-anniversary.svg' => '2nd Work Anniversary',
                        'assets/images/templates/work-anniversary/third-work-anniversary.svg' => '3rd Work Anniversary',
                        'assets/images/templates/work-anniversary/fourth-work-anniversary.svg' => '4th Work Anniversary',
                        'assets/images/templates/work-anniversary/fifth-work-anniversary.svg' => '5th Work Anniversary',
                        'assets/images/templates/work-anniversary/sixth-work-anniversary.svg' => '6th Work Anniversary',
                        'assets/images/templates/work-anniversary/seventh-work-anniversary.svg' => '7th Work Anniversary',
                        'assets/images/templates/work-anniversary/eighth-work-anniversary.svg' => '8th Work Anniversary',
                        'assets/images/templates/work-anniversary/ninth-work-anniversary.svg' => '9th Work Anniversary',
                    ],
                ],
                ['key' => 'profile_image', 'label' => 'Profile Image', 'type' => 'image', 'default' => 'assets/images/default-user.svg'],
            ],
        ],
        [
            'id' => 'birthday',
            'title' => 'Birthday Celebration',
            'category' => 'birthday',
            'description' => 'A warm, personal design for celebrating a colleague and making their day feel special.',
            'preview' => 'assets/images/templates/birthday/birthday-card.svg',
            'partial' => 'birthday.php',
            'fields' => [
                ['key' => 'name', 'label' => 'Name', 'type' => 'text', 'default' => ''],
                ['key' => 'date', 'label' => 'Date', 'type' => 'text', 'default' => ''],
                ['key' => 'main_image', 'label' => 'Image', 'type' => 'image', 'default' => 'assets/images/default-user.svg'],
            ],
        ],
        [
            'id' => 'wedding-anniversary',
            'title' => 'Wedding Anniversary',
            'category' => 'wedding-anniversary',
            'description' => 'An elegant layout for sharing heartfelt wishes and celebrating a lasting partnership.',
            'preview' => 'assets/images/templates/wedding-anniversary/wedding-anniversary.svg',
            'partial' => 'wedding-anniversary.php',
            'fields' => [
                ['key' => 'male_name', 'label' => 'Male Name', 'type' => 'text', 'default' => 'Rahul'],
                ['key' => 'female_name', 'label' => 'Female Name', 'type' => 'text', 'default' => 'Neha'],
                ['key' => 'date', 'label' => 'Date', 'type' => 'text', 'default' => '12th August'],
                ['key' => 'wish', 'label' => 'Anniversary Message', 'type' => 'textarea', 'default' => 'Wishing you both a beautiful anniversary filled with cherished memories, lasting happiness, and many more wonderful years together.'],
                ['key' => 'profile_image', 'label' => 'Couple Image', 'type' => 'image', 'default' => 'assets/images/default-user.svg'],
            ],
        ],
    ],
];
