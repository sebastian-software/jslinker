#!/usr/bin/env bash

OUTPUT="$(pwd)/.jslinker"

die() {
  echo "Error: $*"
  exit 1
}

if [ -z `which tar` ]; then
  die 'tar not found'
fi

if [ -z `which awk` ]; then
  die 'awk not found'
fi

if [ -z `which tail` ]; then
  die 'tail not found'
fi

if [ -f "$OUTPUT" ]; then
  die 'output path must be directory'
fi

[[ ! -d "$OUTPUT" ]] && mkdir "$OUTPUT"

SKIPLINES=`awk '/^__END__/ { print NR + 1; exit 0; }' $0`

tail -n +$SKIPLINES $0 | tar -xz -C "$OUTPUT"
if [ $? != 0 ]; then
  die "cannot extract the files"
fi
