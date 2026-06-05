<?php

declare(strict_types=1);

return [
    'smtp' => [
        'host' => 'thelearningwarehouse.com',
        'port' => 465,
        'encryption' => 'ssl',
        'username' => 'forms@thelearningwarehouse.com',
        'password' => 'CHANGE_ME',
    ],
    'message' => [
        'from_email' => 'forms@thelearningwarehouse.com',
        'from_name' => 'The Learning Warehouse Website',
        'to_email' => 'forms@thelearningwarehouse.com',
        'to_name' => 'The Learning Warehouse',
        'subject_prefix' => '[Website enquiry]',
    ],
];
