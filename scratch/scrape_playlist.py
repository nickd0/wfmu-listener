from bs4 import BeautifulSoup
import requests
import json
import re


def get_param(tag, name):
    try:
        return tag.find("td", class_="col_{}".format(name)).get_text().strip()
    except AttributeError:
        return ""

if __name__ == '__main__':
    results = []
    url = 'https://www.wfmu.org/playlists/shows/101253'
    page = requests.get(url)
    parsed = BeautifulSoup(page.content, 'html.parser')
    fields = ["artist", "song_title", "album_title", "record_label", "year"]

    for row in parsed.find_all(id=re.compile(r"drop_\d+")):
        res = {}
        for f in fields:
            res[f] = get_param(row, f)
        
        ts_raw = get_param(row, "live_timestamps_flag")
        ts_match = re.compile(r"(\d:\d{2}:\d{2})").match(ts_raw)

        if ts_match:
            res["timestamp"] = ts_match[0]
        else:
            res["timestamp"] = None

        results.append(res)

    print(json.dumps(results, indent=4))
