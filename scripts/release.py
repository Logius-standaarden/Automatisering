import os
import re
import shutil
from pathlib import Path

HOME_DIRECTORY = Path.home()
CURRENT_WORKING_DIRECTORY = Path.cwd()
CONTENT_DIRECTORY = HOME_DIRECTORY / "content"

def getValue(var, line):
    comment = line.find("//")
    start = line.find("\"") + 1
    end = line.find("\",")
    if (start * end == 0) or (comment > 0 and (comment < start)):
        return False
    val = line[start:end]
    print(f"{var}: {val}")
    return val


config = f"js/config.js"
with open(config, "r", encoding="utf-8") as f:
    pubDomain = ""
    shortName = ""
    publishVersion = ""

    for line in f:
        if "pubDomain" in line:
            val = getValue("pubDomain", line)
            if val:
                pubDomain = val
        elif "shortName" in line:
            val = getValue("shortName", line)
            if val:
                shortName = val
        elif "publishVersion" in line:
            val = getValue("publishVersion", line)
            if val:
                publishVersion = val

SPECIFICATION_FOLDER = CURRENT_WORKING_DIRECTORY / "publicatie" / pubDomain / shortName

def create_redirect_for_version(publishVersion):
    with open(f'{SPECIFICATION_FOLDER}/index.html', 'w') as root_index_file:
        root_index_file.write(f"""<!DOCTYPE html>
<meta charset="utf-8">
<title>Redirecting to v{publishVersion}</title>
<meta http-equiv="refresh" content="0; URL=./{publishVersion}">
<link rel="canonical" href="./{publishVersion}">
""")

    version_without_last_number = ".".join(re.split("\.", publishVersion)[:-1])

    with open(f'{SPECIFICATION_FOLDER}/{version_without_last_number}/index.html', 'w') as version_redirect_file:
        version_redirect_file.write(f"""<!DOCTYPE html>
<meta charset="utf-8">
<title>Redirecting to v{publishVersion}</title>
<meta http-equiv="refresh" content="0; URL=../{publishVersion}">
<link rel="canonical" href="../{publishVersion}">
""")


if len(pubDomain) * len(shortName) * len(publishVersion) > 0:
    try:
        published_path = SPECIFICATION_FOLDER / publishVersion
        if os.path.exists(published_path):
            shutil.rmtree(published_path)
        shutil.copytree(CONTENT_DIRECTORY, published_path)
        create_redirect_for_version(publishVersion)
    except Exception as e:
        print(e)
else:
    print("Need \'pubDomain\' and \'shortName\' to create path! (case sensitive)")
    sys.exit(2)
