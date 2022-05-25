import pandas as pd
import re
import sys
import argparse
import os

disallowed_symbols = ["console", "log", "setup", "draw", "preload"]


def get_functions():
    file_path = "./p5_reference.txt"
    df = pd.read_csv(file_path, sep="\n\n", header=None)
    data = {}
    current_header = ""

    for item in df.values.tolist():
        ele = item[0].strip()
        if(ele[0].isupper() and ele != "JSON"):
            data[ele] = []
            current_header = ele
        else:
            ele = ele.replace("()", "")
            data[current_header].append(ele)

    del data["Foundation"]

    return data


def get_events():
    events = ['draw()', 'setup()', 'preload()', 'mouseMoved()', 'mouseDragged()', 'mousePressed()', 'mouseReleased()', 'mouseClicked()',
              'doubleClicked()', 'mouseWheel()', 'keyPressed()', 'keyReleased()', 'keyTyped()',  'touchStarted()', 'touchMoved()', 'touchEnded()']

    return events


def events_replace(content, symbol='p'):
    new_content = content
    events = get_events()
    for e in events:
        search_string = rf"\b(?=\w)function {e}\b(?!\w)"
        replace_string = "{}.{} = function".format(symbol, e)
        new_content = re.sub(search_string, replace_string, new_content)

    return new_content


def keyword_replace(content, symbol='p'):
    new_content = content
    functions = get_functions()
    for key, value in functions.items():
        for v in value:
            if(v in new_content and v not in disallowed_symbols):
                search_string = rf"\b(?=\w){v}\b(?!\w)"
                replace_string = "{}.{}".format(symbol, v)
                new_content = re.sub(
                    search_string, replace_string, new_content)
    return new_content


def wrap_content(content, params):
    symbol = params["namespacing_variable"]
    html_element_id = params["html_element_id"]
    new_sketch_name = params["new_sketch_name"]
    new_content = content
    new_content = "var {} = function({}) {{\n\n {} \n}}\n\nvar sketch = new p5({}, '{}');".format(
        new_sketch_name, symbol, new_content, new_sketch_name, html_element_id)
    return new_content


# TODO
# def ignore_comments(content) :
#     return


def global_replace(content, params):
    data = events_replace(content, params["namespacing_variable"])
    data = keyword_replace(data, params["namespacing_variable"])
    if(params["main_file"]):
        print("MAIN FILE : ", params["main_file"])
        data = wrap_content(data, params)

    return data


def write_to_file(file_name, data):
    try:
        f = open(file_name, "w")
        try:
            f.write(data)
        except:
            print("Something went wrong when writing to the file",
                  sys.exc_info()[0])
        finally:
            f.close()
    except:

        print("Something went wrong when opening the file.", sys.exc_info()[0])


def check_params(params):
    params_is_unique = len(set(params)) == len(params)
    if(not params_is_unique):
        msg = "Parameter names must be unique"
        return msg
    for param in params:
        search_string = rf"^[a-zA-Z0-9!@#$&_]*$"
        res = re.match(search_string, param)
        if(res == None):
            msg = "Parameter {} should contain only alphanumeric and these symbols : !@#$&_".format(
                param)
            return msg
    return True


if __name__ == "__main__":

    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter,
                                     description="Parameter for global to instance mode script", allow_abbrev=True, add_help=True)

    parser.add_argument('file', type=str, help="The p5 sketch.js file")
    parser.add_argument(
        'main_file', type=bool, help="Is the main p5 sketch file ( main file is the one containing the setup() and draw() functions )")

    parser.add_argument('--namespacing_variable', action='store', type=str, default="p",
                        help="The string that will be prefixed with every p5 function")

    parser.add_argument('--new_sketch_name', action='store', type=str, default="sketch",
                        help="The name of the new sketch. This will be variable containing the p5 instance object")

    parser.add_argument('--html_element_id', action='store', type=str, default="div1",
                        help="The ID of the HTML element without the hashtag (#) symbol")

    args = parser.parse_args()

    file_path = "./{}".format(args.file)

    if(os.path.exists(file_path)):
        with open(file_path, 'r') as f:
            content = f.readlines()

        content = ''.join(content)

        params = [args.namespacing_variable,
                  args.new_sketch_name, args.html_element_id]

        res = check_params(params)

        if(res == True):
            params = {
                "main_file": args.main_file,
                "namespacing_variable": args.namespacing_variable,
                "new_sketch_name": args.new_sketch_name,
                "html_element_id": args.html_element_id
            }
            new_content = global_replace(content, params)
            print(new_content)

            file_name = "new_script.js"
            write_to_file(file_name, new_content)

        else:
            print("ERROR : ", res)

    else:
        print("No such file exists ! Please make sure that the script and the file are in the same directory.")
