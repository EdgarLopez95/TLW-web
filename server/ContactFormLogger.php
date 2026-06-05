<?php

declare(strict_types=1);

final class ContactFormLogger
{
    private ?string $logFile;

    public function __construct(?string $logFile = null)
    {
        $this->logFile = $logFile;
    }

    public function info(string $event, array $context = []): void
    {
        $this->write('INFO', $event, $context);
    }

    public function error(string $event, array $context = []): void
    {
        $this->write('ERROR', $event, $context);
    }

    private function write(string $level, string $event, array $context): void
    {
        $payload = [
            'timestamp' => gmdate('c'),
            'level' => $level,
            'event' => $event,
            'context' => $this->sanitizeContext($context),
        ];

        $message = json_encode($payload, JSON_UNESCAPED_SLASHES);
        if ($message === false) {
            $message = '{"level":"' . $level . '","event":"' . $event . '"}';
        }

        if ($this->logFile) {
            $directory = dirname($this->logFile);
            if (!is_dir($directory)) {
                mkdir($directory, 0775, true);
            }

            error_log($message . PHP_EOL, 3, $this->logFile);
            return;
        }

        error_log($message);
    }

    private function sanitizeContext(array $context): array
    {
        $clean = [];

        foreach ($context as $key => $value) {
            if (is_scalar($value) || $value === null) {
                $clean[$key] = $this->sanitizeScalar($value);
                continue;
            }

            if (is_array($value)) {
                $clean[$key] = $this->sanitizeContext($value);
            }
        }

        return $clean;
    }

    private function sanitizeScalar($value): ?string
    {
        if ($value === null) {
            return null;
        }

        $string = preg_replace('/\s+/', ' ', (string) $value);
        if ($string === null) {
            return '';
        }

        return substr(trim($string), 0, 300);
    }
}
