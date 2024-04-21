import os
from datetime import datetime

while True:
    if (datetime.now().second == 23):
        os.system('curl -b "myApp=YOURCOOKIE" http://docean.shoxxdj.fr:1001/api/roulette/launch')




