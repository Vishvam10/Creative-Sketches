import re
import sys
import argparse
import os
from unicodedata import name
import uuid

disallowed_symbols = ["console", "log", "setup", "draw", "preload"]
constants = ["HALF_PI", "PI", "QUARTER_PI",
             "TAU", "TWO_PI", "DEGREES", "RADIANS", "JSON"]


def get_functions():
    file_path = "./p5_reference.txt"
    f = open(file_path, "r")

    data = {}
    current_header = ""

    for line in f:
        ele = line.strip()
        if(line[0].isupper() and line != "JSON"):
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
    events = list(map(lambda x: x.replace("()", ""), events))
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
    global im_search_string
    global main_file

    symbol = params["namespacing_variable"]
    html_element_id = params["html_element_id"]
    new_sketch_name = params["new_sketch_name"]
    new_content = content

    if(params["is_main_file"]):
        im_search_string = "var {} = function({})".format(
            new_sketch_name, symbol)

        new_content = "{}\n\nvar sketch = new p5({}, '{}');".format(
            im_search_string, new_content, new_sketch_name, html_element_id)
    else:
        print("IS MAIN FILE : ", params["is_main_file"])
        print("FILE PATH : ", main_file)

        with open(main_file, 'r') as f:
            content = f.readlines()
        content = ''.join(content)
        main_content = content

        im_search_string = im_search_string + " {"
        search_string = rf"{im_search_string}"
        print("SEARCH STRING : ", search_string,
              "SKETCH NAME : ", new_sketch_name)

        replace_string = "{}".format(new_content)

        print("REPLACE STRING : ", replace_string)

        new_content = re.sub(search_string, replace_string, main_content)

    return new_content


# TODO
# def ignore_comments(content) :
#     return


def global_replace(content, params):
    data = events_replace(content, params["namespacing_variable"])
    data = keyword_replace(data, params["namespacing_variable"])
    data = wrap_content(data, params)

    return data


def write_to_file(file_name, data, is_main_file):
    global main_file

    f_name = file_name.split(".")[0]
    f_ext = file_name.split(".")[1]
    new_file_name = f_name + "_" + \
        str(uuid.uuid4()).replace("-", "")[:10] + "." + f_ext
    try:
        f = open(new_file_name, "w")
        try:
            f.write(data)
            if(is_main_file):
                main_file = new_file_name
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


def check_if_file_exists(file_path):
    if(os.path.exists(file_path)):
        return True
    return False


if __name__ == "__main__":

    main_file = ""
    im_search_string = ""

    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter,
                                     description="Parameter for global to instance mode script", allow_abbrev=True, add_help=True)

    parser.add_argument('files', type=str, nargs="+",
                        help="In the format : [main_sketch.js, helper_file1.js, helper_file2.js, . . .]. The main_sketch.js file is the one containing draw() and setup() functions")

    parser.add_argument('--namespacing_variable', action='store', type=str, default="p",
                        help="The string that will be prefixed with every p5 function")

    parser.add_argument('--new_sketch_name', action='store', type=str, default="new_sketch",
                        help="The name of the new sketch. This will be variable containing the p5 instance object")

    parser.add_argument('--html_element_id', action='store', type=str, default="div1",
                        help="The ID of the HTML element without the hashtag (#) symbol")

    args = parser.parse_args()

    for i in range(0, len(args.files)):
        file = args.files[i]
        file_path = "./{}".format(file)
        if(check_if_file_exists(file_path)):
            with open(file_path, 'r') as f:
                content = f.readlines()

            content = ''.join(content)

            arguments = [args.namespacing_variable,
                         args.new_sketch_name, args.html_element_id]

            res = check_params(arguments)

            if(res == True):
                if(i == 0):
                    main_file = file
                    params = {
                        "is_main_file": True,
                        "namespacing_variable": args.namespacing_variable,
                        "new_sketch_name": args.new_sketch_name,
                        "html_element_id": args.html_element_id
                    }
                else:
                    params = {
                        "is_main_file": False,
                        "namespacing_variable": args.namespacing_variable,
                        "new_sketch_name": args.new_sketch_name,
                        "html_element_id": args.html_element_id
                    }
                new_content = global_replace(content, params)
                if(i == 0):
                    file_name = "new_main_script.js"
                    write_to_file(file_name, new_content, True)
                else:
                    file_name = "new_script.js"
                    write_to_file(file_name, new_content, False)

            else:
                print("ERROR : ", res)

        else:
            print(
                "No such file exists ! Please make sure that the script and the file are in the same directory.")
