import sys 
import requests 
from bs4 import BeautifulSoup  
from csv import writer 
import time
import shutil
# bs4 module for web scraping and requests for making HTTPS requests using Python. 
# response = requests.get('https://leetcode.com / shubhamk314') 
# soup = BeautifulSoup(response.text, 'html.parser') 
# main_content = soup.select( 
#     '# base_content>div>div>div.col-sm-5.col-md-4>div:nth-child(3)>ul') 
# list_items = main_content[0].select('li') 
# items = ['Solved Question', 'Accepted Submission', 'Acceptance Rate'] 
# n = 0
  
# # It will create csv files named progress.csv in root folder once this is script is called. 
# with open('progress.csv', 'w') as csv_file: 
#   csv_writer = writer(csv_file) 
#   headers = ['Name', 'Score'] 
#   csv_writer.writerow(headers) 
#   while(n < 3): 
#     name = items[n] 
#     score = list_items[n].find('span').get_text().strip() 
#     csv_writer.writerow([name, score]) 
#     n = n + 1

raw_address = sys.argv[-3]
client_address = sys.argv[-2]
file_name = sys.argv[-1]

#output_name = file_name[:-4] + "_output.txt" #remove .txt and add _output.txt
input_address = raw_address + file_name
#output_address = client_address + output_name

''' 
# read the input file and write a modified version to the output dir
fin = open(input_address, "rt")


fout = open(output_address, "wt")
for line in fin:
	fout.write(line + " modified ")
#close input and output files
fin.close()
fout.close()
'''

#move the input file to another folder
time.sleep(3) 
shutil.move(input_address, client_address)

print(client_address)