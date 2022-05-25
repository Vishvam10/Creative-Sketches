import argparse
import os

parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter,
                                 description="Parameter for global to instance mode script", allow_abbrev=True, add_help=True)


parser.add_argument('file', type=str, help="The p5 sketch.js file")
parser.add_argument('namespacing_variable', action='store', type=str,
                    help="The string that will be prefixed with every p5 function")
parser.add_argument('new_sketch_name', action='store', type=str, default="sketch",
                    help="The name of the new sketch. This will be variable containing the p5 instance object")
parser.add_argument('html_element_id', action='store', type=str, default="div1",
                    help="The ID of the HTML element without the hashtag (#) symbol")

args = parser.parse_args()

file_path = "./{}".format(args.file)
if(os.path.exists(file_path)):
    params = {
        "file": file_path,
        "namespacing_variable": args.namespacing_variable,
        "new_sketch_name": args.new_sketch_name,
        "html_element_id": args.html_element_id
    }

    print(params)

    with open(file_path) as f:
        lines = f.readlines()
        print(lines)
else:
    print("No such file exists ! Please make sure that the script and the file are in the same directory.")
