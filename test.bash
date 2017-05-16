#!/bin/sh

test() {
echo "TEST" >> /testing.txt
STR=$(df -h | cut -d "%" -f1 | cut -d " " -f37| head -1)
if [ "$STR" == "iused" ]
then
return 1
else
return 0
fi
}
$@
