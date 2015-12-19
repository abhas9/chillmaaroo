#!/bin/bash

echo "Building source.";
cd ./source/;
gulp build;

cd ../;

echo "Deleting files in ./www";
rm -rf ./www/*;

cd www;
mkdir dist;
cd ..;

echo "Copying files";
cp -r ./source/dist/* ./www/dist/;
cp -r ./source/index.html ./www/;

