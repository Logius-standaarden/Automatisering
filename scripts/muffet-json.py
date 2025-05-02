import json
import os
import re
import requests
import sys

JSON_PATH = 'muffet.json'

if not os.path.exists(JSON_PATH) or os.path.getsize(JSON_PATH) == 0:
    sys.exit(0)

errors = 0
content = ''

with open(JSON_PATH, 'r',  encoding='utf-8') as input_file:
    data = json.loads(input_file.read().rstrip())
    data = sorted(data, key=lambda k: k['url'])
    for page in data:
        if re.search("publicatie\/", page['url']):
            content += '\n### ' + page['url'] + '\n'
            page['links'] = sorted(page['links'], key=lambda k: k['url'])
            for link in page['links']:
                errors += 1
                content += '* ' + link['url'] + ' `' + link['error'] + '`' + '\n'

with open('links.md', 'w') as output_file:
    output_file.write('## ' + str(errors) + ' broken links\n')
    output_file.write(content)
