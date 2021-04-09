import sys 
import requests 
import time
import shutil

raw_address = sys.argv[-3] #the address where the input file locates
client_address = sys.argv[-2] #the goal address needed by frontend
file_name = sys.argv[-1] #input file name
input_address = raw_address + file_name #path of the input file

#Main Logic - Generate File

#move the generated file to folder needed by frontend
time.sleep(3) 
shutil.move(input_address, client_address) #dummy, currently it directly moves the original file

print(client_address)