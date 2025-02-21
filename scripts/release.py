import os
import re
import shutil


def getValue(var, line):
    comment = line.find("//")
    start = line.find("\"") + 1
    end = line.find("\",")
    if (start * end == 0) or (comment > 0 and (comment < start)):
        return False
    val = line[start:end]
    print(f"{var}: {val}")
    return val


content = "content"
config = f"{content}/js/config.js"
f = open(config, "r", encoding="utf-8")

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
f.close()
os.remove(config)

def create_redirect_for_version(publishVersion):
    root_index_file = open(f'{content}/index.html', 'w')
    root_index_file.write("""<!DOCTYPE html>
<meta charset="utf-8">
<title>Redirecting to v{publishVersion}</title>
<meta http-equiv="refresh" content="0; URL=./{publishVersion}">
<link rel="canonical" href="./{publishVersion}">
""")
    root_index_file.close()

    version_without_last_number = ".".join(re.split("\.", txt)[:-1])

    version_redirect_file = open(f'{content}/{version_without_last_number}/index.html', 'w')
    version_redirect_file.write("""<!DOCTYPE html>
<meta charset="utf-8">
<title>Redirecting to v{publishVersion}</title>
<meta http-equiv="refresh" content="0; URL=../{publishVersion}">
<link rel="canonical" href="../{publishVersion}">
""")
    version_redirect_file.close()

if len(pubDomain) * len(shortName) > 0:
    try:
        if len(publishVersion) > 0:
            shutil.move(content, f"{content}/{publishVersion}")
            create_redirect_for_version(publishVersion)
        path = f"publicatie/{pubDomain}/{shortName}/"
        if not os.path.exists(path):
            os.makedirs(path)
        for fn in os.listdir(path):
            # https://stackoverflow.com/a/185941
            file_path = os.path.join(path, fn)
            try:
                print("file_path: " + file_path)
                if os.path.isdir(file_path):
                    files = os.listdir(file_path)
                    if "index.html" in files and fn != publishVersion:
                        shutil.copytree(file_path, f"{content}/{fn}")
            except Exception as e:
                print(e)
        shutil.rmtree(path)
        print("Cleared dir: " + path)
        shutil.copytree(content, path)
        print("Created dir: " + path)
    except Exception as e:
        print(e)
else:
    print("Need \'pubDomain\' and \'shortName\' to create path! (case sensitive)")
    sys.exit(2)
