import os
from github import Github

g = Github(os.environ['SANDERKE'])
org = g.get_organization('Logius-standaarden')
repos = org.get_repos()
labels = org.get_repo('Automatisering').get_labels()

for repo in repos:
    if not (repo.name.startswith('Digikoppeling') or repo.name.startswith('BOMOS')):
        continue
    print('Checking ' + repo.name)
    repo_labels = repo.get_labels()
    for label in labels:
        found = False
        for repo_label in repo_labels:
            if repo_label.name == label.name:
                found = True
                break
        if not found:
            repo.create_label(name=label.name, color=label.color, description=label.description)
            print(f'Created label \'{label.name}\'')
