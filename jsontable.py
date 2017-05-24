#!/QOpenSys/QIBM/ProdData/OPS/Python3.4

import sys, json
from json2html import *

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    #get our data as an array from read_in()
    lines = read_in()
    data = json2html.convert(lines)
    js = [{'Data': data}]
    
    print(json.dumps(js))

    
# Start process
if __name__ == '__main__':
    main()

