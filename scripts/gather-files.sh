rm -rf ~/content
mkdir ~/content
cp ~/static/* ~/content/
if [ -d ./media ]; then
    mkdir -p ~/content/media/
    cp -r ./media/* ~/content/media/ 2>/dev/null || true
fi
