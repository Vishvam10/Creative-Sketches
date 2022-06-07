# Global to Instance Mode

This is a python script to convert a p5 sketch from a global to instance mode. Though under develpment, it works well with single "sketch" files. 


## Todo

- [x] Get all the p5 global variables, function and events
- [x] Namespace p5 functions
- [x] Create new sketch instances dynamically
- [x] Create a command line tool to execute the script with parameters
- [x] Convert helper JS files too
- [x] Add helper classes to instance mode ( within the main sketch file )
- [x] Add `minify` and `combine_helpers_into_main_script` functionality
- [ ] Ignore comments


## Optional Functionalities : 

- [ ] Convert scripts with multiple imports and exports
- [ ] Convert all p5 scripts in a folder into instance mode   
- [ ] Bundle it into a package 
- [ ] Format JS after replacing


## Issues

- [x] Appends multiple `namespacing_variable` while working with multiple helper functions
- [ ] p5 global functions are still prefixed with namespacing variable
- [ ] A few functions like strokeWeight are not getting recognized when separating multiple helper files are involved
