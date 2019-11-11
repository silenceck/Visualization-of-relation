import json,sys

if __name__ == '__main__':   
    # for line in sys.stdin:
    #     print(json.loads(line)['args'])
    s = sys.stdin.read()
    print(s)
    sys.stdout.flush()