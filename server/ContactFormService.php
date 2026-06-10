<?php

declare(strict_types=1);

require_once __DIR__ . '/PHPMailer/src/Exception.php';
require_once __DIR__ . '/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;

final class ContactFormService
{
    private array $config;
    private ContactFormLogger $logger;

    public function __construct(array $config, ContactFormLogger $logger)
    {
        $this->config = $config;
        $this->logger = $logger;
    }

    public function handle(array $rawInput, array $server): array
    {
        $submissionId = bin2hex(random_bytes(8));
        $data = $this->normaliseInput($rawInput);
        $errors = $this->validate($data);

        if ($errors !== []) {
            $this->logger->info('contact_form.validation_failed', [
                'submission_id' => $submissionId,
                'email' => $data['email'],
                'error_fields' => array_keys($errors),
            ]);

            return [
                'ok' => false,
                'status' => 'invalid',
                'message' => 'Please correct the highlighted fields and try again.',
                'errors' => $errors,
                'httpCode' => 422,
                'submissionId' => $submissionId,
            ];
        }

        if (!$this->isConfigured()) {
            $this->logger->error('contact_form.setup_incomplete', [
                'submission_id' => $submissionId,
            ]);

            return [
                'ok' => false,
                'status' => 'setup',
                'message' => 'The contact form is still being set up. Please email us directly for now.',
                'httpCode' => 500,
                'submissionId' => $submissionId,
            ];
        }

        try {
            $this->send($data, $submissionId, $server);
        } catch (Throwable $exception) {
            $this->logger->error('contact_form.send_failed', [
                'submission_id' => $submissionId,
                'email' => $data['email'],
                'error' => $exception->getMessage(),
            ]);

            return [
                'ok' => false,
                'status' => 'server',
                'message' => 'We could not send your message just now. Please try again shortly.',
                'httpCode' => 502,
                'submissionId' => $submissionId,
            ];
        }

        $this->logger->info('contact_form.sent', [
            'submission_id' => $submissionId,
            'email' => $data['email'],
            'organisation' => $data['organisation'],
        ]);

        return [
            'ok' => true,
            'status' => 'success',
            'message' => 'Thanks. We received your message and will get back to you in the next 24 hours.',
            'httpCode' => 200,
            'submissionId' => $submissionId,
        ];
    }

    private function normaliseInput(array $rawInput): array
    {
        return [
            'name' => trim((string) ($rawInput['name'] ?? '')),
            'organisation' => trim((string) ($rawInput['organisation'] ?? '')),
            'email' => trim((string) ($rawInput['email'] ?? '')),
            'message' => trim((string) ($rawInput['message'] ?? '')),
        ];
    }

    private function validate(array $data): array
    {
        $errors = [];

        if ($data['name'] === '') {
            $errors['contact-name'] = 'Add your name.';
        }

        if ($data['email'] === '') {
            $errors['contact-email'] = 'Enter your email.';
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['contact-email'] = 'Enter a valid email address.';
        }

        if ($data['message'] === '') {
            $errors['contact-message'] = 'Share a short message so we know how to help.';
        }

        return $errors;
    }

    private function isConfigured(): bool
    {
        $smtp = $this->config['smtp'] ?? [];
        $message = $this->config['message'] ?? [];

        $required = [
            $smtp['host'] ?? '',
            (string) ($smtp['port'] ?? ''),
            $smtp['username'] ?? '',
            $smtp['password'] ?? '',
            $message['from_email'] ?? '',
            $message['to_email'] ?? '',
        ];

        foreach ($required as $value) {
            if ($value === '' || $value === 'CHANGE_ME') {
                return false;
            }
        }

        return true;
    }

    private function send(array $data, string $submissionId, array $server): void
    {
        $smtp = $this->config['smtp'];
        $messageConfig = $this->config['message'];

        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = (string) $smtp['host'];
        $mail->SMTPAuth = true;
        $mail->Username = (string) $smtp['username'];
        $mail->Password = (string) $smtp['password'];
        $mail->Port = (int) $smtp['port'];
        $mail->CharSet = 'UTF-8';

        $encryption = strtolower((string) ($smtp['encryption'] ?? 'ssl'));
        if ($encryption === 'tls') {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        } else {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        }

        $mail->setFrom((string) $messageConfig['from_email'], (string) ($messageConfig['from_name'] ?? 'Website contact form'));
        $mail->addAddress((string) $messageConfig['to_email'], (string) ($messageConfig['to_name'] ?? 'Website enquiries'));
        $mail->addReplyTo($data['email'], $data['name']);
        $mail->Subject = $this->buildSubject($data, $messageConfig);
        $mail->isHTML(true);
        $mail->Body = $this->buildHtmlBody($data, $submissionId, $server);
        $mail->AltBody = $this->buildTextBody($data, $submissionId, $server);

        $mail->send();
    }

    private function buildSubject(array $data, array $messageConfig): string
    {
        $prefix = trim((string) ($messageConfig['subject_prefix'] ?? '[Website enquiry]'));
        return sprintf('%s %s', $prefix, $data['name']);
    }

    private function buildHtmlBody(array $data, string $submissionId, array $server): string
    {
        $submittedAt = gmdate('j F Y g:i a') . ' UTC';
        $remoteAddress = $server['REMOTE_ADDR'] ?? 'Unavailable';
        $pageUrl = $server['HTTP_ORIGIN'] ?? $server['HTTP_REFERER'] ?? 'Unavailable';

        $rows = [
            'Name' => $data['name'],
            'Organisation' => $data['organisation'] !== '' ? $data['organisation'] : 'Not provided',
            'Email' => $data['email'],
            'Submitted' => $submittedAt,
            'Submission ID' => $submissionId,
            'Source' => $pageUrl,
            'Remote address' => $remoteAddress,
        ];

        $html = '<h2>New website enquiry</h2><table cellpadding="8" cellspacing="0" border="0">';
        foreach ($rows as $label => $value) {
            $html .= sprintf(
                '<tr><td><strong>%s</strong></td><td>%s</td></tr>',
                htmlspecialchars($label, ENT_QUOTES, 'UTF-8'),
                nl2br(htmlspecialchars($value, ENT_QUOTES, 'UTF-8'))
            );
        }
        $html .= '</table>';
        $html .= '<h3>Message</h3>';
        $html .= sprintf(
            '<p>%s</p>',
            nl2br(htmlspecialchars($data['message'], ENT_QUOTES, 'UTF-8'))
        );

        return $html;
    }

    private function buildTextBody(array $data, string $submissionId, array $server): string
    {
        $submittedAt = gmdate('j F Y g:i a') . ' UTC';
        $remoteAddress = $server['REMOTE_ADDR'] ?? 'Unavailable';
        $pageUrl = $server['HTTP_ORIGIN'] ?? $server['HTTP_REFERER'] ?? 'Unavailable';

        return implode(PHP_EOL, [
            'New website enquiry',
            '',
            'Name: ' . $data['name'],
            'Organisation: ' . ($data['organisation'] !== '' ? $data['organisation'] : 'Not provided'),
            'Email: ' . $data['email'],
            'Submitted: ' . $submittedAt,
            'Submission ID: ' . $submissionId,
            'Source: ' . $pageUrl,
            'Remote address: ' . $remoteAddress,
            '',
            'Message:',
            $data['message'],
        ]);
    }
}
