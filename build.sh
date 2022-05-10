#!/bin/bash

export REACT_APP_VERSION_HASH=$(git describe --always)
echo "Current version hash: ${REACT_APP_VERSION_HASH}"
yarn build
