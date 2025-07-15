import os
import shutil
import sys
import tempfile
import urllib.request

# pip 23.0.1 is compatible with most Python 3.x versions
GET_PIP_URL = "https://bootstrap.pypa.io/pip/3.6/get-pip.py"

def download_file(url, dest_path):
    with urllib.request.urlopen(url) as response, open(dest_path, 'wb') as out_file:
        shutil.copyfileobj(response, out_file)

def main():
    print("Downloading get-pip.py...")
    temp_dir = tempfile.mkdtemp()
    get_pip_path = os.path.join(temp_dir, "get-pip.py")

    download_file(GET_PIP_URL, get_pip_path)

    print("Running get-pip.py...")
    os.system(f'"{sys.executable}" "{get_pip_path}"')

if __name__ == "__main__":
    main()
