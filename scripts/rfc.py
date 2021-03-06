import os
from github import Github
import requests

g = Github(os.environ['BEHEER'])

org = g.get_organization('Logius-standaarden')
repos = org.get_repos()
issue_base = 'Logius-standaarden/Digikoppeling-Algemeen'
rfcs = {}

for repo in repos:
    pull_requests = repo.get_pulls(state='open', base='develop')
    for pr in pull_requests:
        if pr.body is not None and pr.body.__contains__(issue_base + '#'):
            loc = pr.body.find(issue_base) + len(issue_base) + 1
            number = int(pr.body[loc:loc+2])
            content = ''
            if rfcs.get(number) is not None:
                content = rfcs.get(number)
            r = requests.get(pr.diff_url, timeout=5)
            details = f'<details><summary>Wijzigingen</summary>\n\n```diff\n{r.text}\n```\n\n</details>'
            preview = f'[Preview](https://logius-standaarden.github.io/Publicatie-Preview/{repo.name}/{pr.head.ref})'
            content = f'{content}\n#### {repo.name}\n[Pull request]({pr.html_url}) | {preview}\n{details}\n'
            rfcs.update({number: content})

f = open('Digikoppeling/rfc.md', 'w')
f.write('# RFC-lijst')
keys = rfcs.keys()
for key in keys:
    rfc = g.get_repo(issue_base).get_issue(key)
    content = f'\n## RFC: {rfc.title}\n{rfc.body}\n### Aangepaste documenten\n{rfcs.get(key)}'
    f.write(content)
f.close()
