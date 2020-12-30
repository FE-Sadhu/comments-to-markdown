#! /bin/sh 
# 我靠，现在 shell 可以自动识别环境了？
# if["$(uname)"=="Darwin"];then
# # 留拓展
# elif["$(expr substr $(uname -s) 1 5)"=="Linux"];then   
# # 留拓展
# elif["$(expr substr $(uname -s) 1 10)"=="MINGW32_NT"];then    
# # 留拓展
# fi
# read -p "write road：" _PATH

_CONF="./conf.json"

while getopts "p:" opt
do
    case $opt in
        p)
        _PATH=$OPTARG
        ;;
        ?)
        echo "未知参数"
        exit 1;;
    esac
done



eval "jsdoc $_PATH -c $_CONF"
exit 0
