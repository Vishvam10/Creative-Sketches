# Global to Instance Mode

This is a command line tool for converting a p5 sketch from a global to instance mode. This tool can work with single as well multiple files.

<br>

## Dependencies

Only `jsmin` for code minification. Install it using `pip` ( Use pip3 if there is some problem with the installation ) :


    pip install jsmin

<br>

## Usage

**NOTE** : Make sure the following file hierarchy holds while executing the script and INCLUDE `p5_reference.txt` file as the script depends on it

```
-- folder
    -- p5_reference.txt
    -- gtoi.py
    -- sketch_file.js
    -- helper1.js
    -- helper2.js
    ...

```

Basic Syntax :

    python gtoi.py sketch_file.js

For multiple files, just add them in the following manner :

    python gtoi.py sketch_file.js helper1.js helper2.js . . .

## Command Line Options

Use `python gtoi.py -h` or `python gtoi.py --help` to view the CLI arguments while using it. For the sake of completeness, here they are :

    usage: gtoi.py [-h] [-nspv NAMESPACING_VARIABLE] [-nsk NEW_SKETCH_NAME]  
               [-id HTML_ELEMENT_ID] [-s] [-m]
               files [files ...]

    Parameter for global to instance mode script

    positional arguments:
    files                 In the format : [main_sketch.js,
                            helper_file1.js, helper_file2.js, . . .]. The    
                            main_sketch.js file is the one containing        
                            draw() and setup() functions

    optional arguments:
    -h, --help            show this help message and exit
    -nspv NAMESPACING_VARIABLE, --namespacing_variable NAMESPACING_VARIABLE                        The string that will be prefixed with every p5   
                            function (default: p)
    -nsk NEW_SKETCH_NAME, --new_sketch_name NEW_SKETCH_NAME
                            The name of the new sketch. This will be
                            variable containing the p5 instance object       
                            (default: new_sketch)
    -id HTML_ELEMENT_ID, --html_element_id HTML_ELEMENT_ID
                            The ID of the HTML element without the hashtag   
                            (#) symbol (default: div1)
    -s, --separate        Add all the helper files to the main sketch      
                            (default: False)
    -m, --minify_content  Minify the final code (default: False)

<br>

## Todo

- [x] Get all the p5 global variables, function and events
- [x] Namespace p5 functions
- [x] Create new sketch instances dynamically
- [x] Create a command line tool to execute the script with parameters
- [x] Convert helper JS files too
- [x] Add helper classes to instance mode ( within the main sketch file )
- [x] Add `minify` and `combine_helpers_into_main_script` functionality
- [ ] Ignore comments

<br>

## Optional Functionalities : 

- [ ] Convert scripts with multiple imports and exports
- [ ] Convert all p5 scripts in a folder into instance mode   
- [ ] Bundle it into a package 
- [ ] Format JS after replacing


## Issues

- [x] Appends multiple `namespacing_variable` while working with multiple helper functions
- [ ] p5 global functions are still prefixed with namespacing variable
- [ ] A few functions like strokeWeight are not getting recognized when separating multiple helper files are involved
- [ ] p5 variables that are native to the classes ( i.e. it has a `this` keyword before it ) are getting namespaced too
