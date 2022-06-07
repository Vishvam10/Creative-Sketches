import re
import sys
import argparse
import os
import uuid
from jsmin import jsmin

disallowed_symbols = ["console", "log", "setup", "draw", "preload"]
constants = ["HALF_PI", "PI", "QUARTER_PI",
             "TAU", "TWO_PI", "DEGREES", "RADIANS", "JSON"]


class CommandLineTextFormat:
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    DARKCYAN = '\033[36m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'


# def install_package(package):
#     subprocess.check_call([sys.executable, "-m", "pip", "install", package])

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
    global main_file

    symbol = params["namespacing_variable"]
    html_element_id = params["html_element_id"]
    new_sketch_name = params["new_sketch_name"]
    new_content = content

    im_search_string = "var {} = function({}) {{".format(
        new_sketch_name, symbol)

    if(params["is_main_file"]):
        new_content = "var {} = function({}) {{\n\n {} \n}}\n\nvar sketch = new p5({}, '{}');".format(
            new_sketch_name, symbol, new_content, new_sketch_name, html_element_id)
    else:
        if(not params["separate"]):
            with open(main_file, 'r') as f:
                content = f.readlines()

            content = ''.join(content)
            search_string = rf"{im_search_string}"

            main_content = content.replace(search_string, "")
            replace_string = "{} {} {}".format(
                search_string, new_content, main_content)

            new_content = replace_string

    return new_content


def minify_code(data):
    print("IN MINIFY")
    minified_content = jsmin(data)
    msg = "{} {} {}".format(CommandLineTextFormat.GREEN,
                            minified_content, CommandLineTextFormat.END)
    print(msg)
    data = minified_content
    return data

# TODO
# def ignore_comments(content) :
#     return


def global_replace(content, params, minify_content=False):
    data = events_replace(content, params["namespacing_variable"])
    data = keyword_replace(data, params["namespacing_variable"])
    data = wrap_content(data, params)
    return data


def write_to_file(file_name, data, is_main_file, hash_file_name=False):
    global main_file

    f_name = file_name.split(".")[0]
    f_ext = file_name.split(".")[1]
    if(not hash_file_name):
        new_file_name = f_name + "." + f_ext
    else:
        new_file_name = f_name + "_" + \
            str(uuid.uuid4()).replace("-", "s")[:10] + "." + f_ext
        print("FILE NAME : ", new_file_name)

    try:
        f = open(new_file_name, "w")
        try:
            f.write(data)
            if(is_main_file):
                main_file = new_file_name
        except:
            msg = "{} {} ERROR {} : Something went wrong when opening the file : {} {} {}".format(
                CommandLineTextFormat.BOLD, CommandLineTextFormat.RED, CommandLineTextFormat.END, CommandLineTextFormat.BOLD, file_name, CommandLineTextFormat.END)
            print(msg, sys.exc_info()[0])
        finally:
            f.close()
    except:
        msg = "{} {} ERROR {} : Something went wrong when opening the file : {} {} {}".format(
            CommandLineTextFormat.BOLD, CommandLineTextFormat.RED, CommandLineTextFormat.END, CommandLineTextFormat.BOLD, file_name, CommandLineTextFormat.END)
        print(msg, sys.exc_info()[0])


def check_params(params):
    if(not len(set(params)) == len(params)):
        msg = "Parameter names must be unique"
        return msg
    for param in params:
        search_string = rf"^[a-zA-Z0-9!@#$&_]*$"
        if(type(param) == str):
            res = re.match(search_string, param)
            if(res == None):
                msg = "Parameter {} {} {} should contain only alphanumeric and these symbols : !, @, #, $, & and _".format(
                    CommandLineTextFormat.BOLD, param, CommandLineTextFormat.END)
                return msg
            if param in get_functions() or param in get_events() or param in disallowed_symbols or param in constants:
                msg = "Parameter " + CommandLineTextFormat.BOLD + param + CommandLineTextFormat.END + \
                    " is one of the p5 or javascript reserved keywords. Please use a different name."
                return msg

    return True


def check_if_file_exists(file_path):
    if(os.path.exists(file_path)):
        return True
    return False


if __name__ == "__main__":

    main_file = ""

    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter,
                                     description="Parameter for global to instance mode script", allow_abbrev=True, add_help=True)

    parser.add_argument('files', type=str, nargs="+",
                        help="In the format : [main_sketch.js, helper_file1.js, helper_file2.js, . . .]. The main_sketch.js file is the one containing draw() and setup() functions")

    parser.add_argument('-nspv', '--namespacing_variable', action='store', type=str, default="p",
                        help="The string that will be prefixed with every p5 function")

    parser.add_argument('-nsk', '--new_sketch_name', action='store', type=str, default="new_sketch",
                        help="The name of the new sketch. This will be variable containing the p5 instance object")

    parser.add_argument('-id', '--html_element_id', action='store', type=str, default="div1",
                        help="\n\nThe ID of the HTML element without the hashtag (#) symbol")

    parser.add_argument('-s', '--separate', action='store_true',
                        default=False, help="Add all the helper files to the main sketch")

    parser.add_argument('-m', '--minify_content', action='store_true',
                        default=False, help="Minify the final code")

    args = parser.parse_args()

    msg = "{} {} {}".format(CommandLineTextFormat.BOLD,
                            args.separate, CommandLineTextFormat.END)
    print(msg)

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
                    hash_file_name = False
                    main_file = file
                    params = {
                        "is_main_file": True,
                        "separate": args.separate,
                        "namespacing_variable": args.namespacing_variable,
                        "new_sketch_name": args.new_sketch_name,
                        "html_element_id": args.html_element_id
                    }
                    new_content = global_replace(
                        content, params, args.minify_content)
                    new_file = "new_main_script.js"
                    write_to_file(
                        new_file, new_content, params["is_main_file"], hash_file_name)
                else:
                    params = {
                        "is_main_file": False,
                        "separate": args.separate,
                        "namespacing_variable": args.namespacing_variable,
                        "new_sketch_name": args.new_sketch_name,
                        "html_element_id": args.html_element_id
                    }
                    new_content = global_replace(
                        content, params,  args.minify_content)
                    if(not args.separate):
                        hash_file_name = False
                        write_to_file(
                            main_file, new_content, params["is_main_file"], hash_file_name)
                    else:
                        hash_file_name = True
                        write_to_file(
                            file, new_content, params["is_main_file"], hash_file_name)

            else:
                msg = CommandLineTextFormat.BOLD + CommandLineTextFormat.RED + \
                    "ERROR : " + CommandLineTextFormat.END
                print(msg, res)
                exit(0)

        else:
            print(
                "No such file exists ! Please make sure that the script and the file are in the same directory.")

    if(args.minify_content and not args.separate):
        file_name = main_file
        is_main_file = True
        hash_file_name = False
        if(check_if_file_exists(file_name)):
            with open(file_name, 'r') as f:
                content = f.readlines()
            content = ''.join(content)
            data = minify_code(content)

            write_to_file(file_name, data, is_main_file, hash_file_name)
