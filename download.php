<?php
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';

$ios     = 'https://apps.apple.com/app/id6775478256';
$android = 'https://play.google.com/store/apps/details?id=de.riccardopopp.fuerstenwalde';
$default = 'https://mein-fw.de';

if (stripos($ua, 'iPhone') !== false || stripos($ua, 'iPad') !== false || stripos($ua, 'iPod') !== false) {
    header('Location: ' . $ios, true, 302);
} elseif (stripos($ua, 'Android') !== false) {
    header('Location: ' . $android, true, 302);
} else {
    header('Location: ' . $default, true, 302);
}
exit;
