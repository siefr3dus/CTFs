<?php

if (isset($_POST['Submit'])) {
    $target = trim($_REQUEST['ip']);

    $substitutions = array(
        ' ' => '',
        '&'  => '',
        '&&' => '',
        '('  => '',
        ')'  => '',
        '-'  => '',
        '`'  => '',
        '|' => '',
        '||' => '',
        '; ' => '',    
        '%' => '',
        '~' => '',
        '<' => '',
        '>' => '',
        '/ ' => '',
        '\\' => '',
        'ls' => '',
        'cat' => '',
        'less' => '',
        'tail' => '',
        'more' => '',
        'whoami' => '',
        'pwd' => '',
        'busybox' => '',
        'nc' => '',
        'exec' => '',
        'sh' => '',
        'bash' => '',
        'php' => '',
        'perl' => '',
        'python' => '',
        'ruby' => '',
        'java' => '',
        'javac' => '',
        'gcc' => '',
        'g++' => '',
        'make' => '',
        'cmake' => '',
        'nmap' => '',
        'wget' => '',
        'curl' => '',
        'scp' => '',
        'ssh' => '',
        'ftp' => '',
        'telnet' => '',
        'dig' => '',
        'nslookup' => '',
        'iptables' => '',
        'chmod' => '',
        'chown' => '',
        'chgrp' => '',
        'kill' => '',
        'killall' => '',
        'service' => '',
        'systemctl' => '',
        'sudo' => '',
        'su' => '',
        'flag' => '',
    );

    $target = str_replace(array_keys($substitutions), $substitutions, $target);

    // Write the sanitized $target to a file
    $file = '/var/www/html/sanitized_target.txt'; // Name of the file where the sanitized target will be written
    file_put_contents($file, $target . PHP_EOL, FILE_APPEND);

    if (stristr(php_uname('s'), 'Windows NT')) {
        $cmd = shell_exec('ping ' . $target);
    } else {
        $cmd = shell_exec('ping -c 4 ' . (string)$target);
        echo $cmd;
    }
}
