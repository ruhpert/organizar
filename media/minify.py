#!/usr/bin/python
# -*- coding: utf-8 -*-

import os
import sys
import re

output = ""

args = sys.argv
nbr_of_args = len(args)
target_file = None
target_file_name = "min"
path = None

prepared_file = None

if (nbr_of_args > 2):
	requested_type = str(args[1])
	path = str(args[2])

	if (nbr_of_args > 3):
		target_file_name = str(args[3])
	print "FILE TYPE " + requested_type
	print "PATH " + path
	print "TARGET FILE NAME " + target_file_name

	path_to_target_file = path + "/" + target_file_name
	prepared_file = open(path_to_target_file, "w")

else:
        print("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n")
        print("USAGE: python minify.py [FILETYPE] [DIRECTORY] [TARGETS_FILENAME]")
        print("INFO: the minified file will be created in the [DIRECTORY]")
        print("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

def init():
	try:
		dir_list = os.listdir(path)
		dir_list.sort()

		for curr_file in dir_list:
			try:
				data = curr_file.split(".")
				file_name = data[0]
				file_type = data[1]
			
				if file_type == requested_type:
					print "INFO: minifying " + curr_file
					minify(curr_file, file_type)
					
			except:
				print "ERROR: during minifying " + curr_file
	except:
		print "ERROR: could not load files"

def minify(_file, file_type):
	if path is not None:
		try:
			print "minifying..."
			path_to_file = str(path + "/" + _file)
			reading_file = open(path_to_file, "r")

			for line in reading_file:
				line = re.sub(r'[\t\n\s ]+', " ", line)
				line = line.replace(" ", "")

				prepared_file.write(line)
				print line
			print "...done"
		except:
			print "ERROR: could not minify file " + _file


if __name__ == "__main__":
	init()
