# from sklearn.neural_network import MLPRegressor
from sklearn.externals import joblib
import numpy as np
import sys
import datetime
from time import gmtime, strftime

python_clf = joblib.load('Python_model.sav')
java_clf = joblib.load('JAVA_model.sav')
js_clf = joblib.load('JS_model.sav')
html_clf = joblib.load('HTML_model.sav')
c_clf = joblib.load('C_model.sav')
cpp_clf = joblib.load('Cpp_model.sav')
cs_clf = joblib.load('Csharp_model.sav')
go_clf = joblib.load('GO_model.sav')
css_clf = joblib.load('CSS_model.sav')
shell_clf = joblib.load('Shell_model.sav')


models = {'Python':python_clf,'Java':java_clf,'JavaScript':js_clf,'HTML':html_clf,'C':c_clf,'C++':cpp_clf,'C#':cs_clf,'Go':go_clf,'CSS':css_clf,'Shell':shell_clf}

languages = ['Python','Java','JavaScript','HTML','C','C++','C#','Go','CSS','Shell']
repositories = {'Python':[],'Java':[],'JavaScript':[],'HTML':[],'C':[],'C++':[],'C#':[],'Go':[],'CSS':[],'Shell':[],'extra':[]}
repo_names = {'Python':[],'Java':[],'JavaScript':[],'HTML':[],'C':[],'C++':[],'C#':[],'Go':[],'CSS':[],'Shell':[],'extra':[]}
count = {'Python':0,'Java':0,'JavaScript':0,'HTML':0,'C':0,'C++':0,'C#':0,'Go':0,'CSS':0,'Shell':0}

predictions = dict()
# repositories = dict()

# data_x = [["21Lane","Python","1/7/17 18:04",4,1,4,289,1,1],["cool-physics","HTML","1/28/18 07:19",12,4,12,38,5,4],["dummy",'',"1/21/17 13:27",0,0,0,0,0,0],["experiment","C","5/26/16 07:13",0,1,0,8,0,1],["foss-profile-templates","HTML","9/19/16 15:34",1,6,1,34,1,7],["gmail-notifier-gtk","Python","3/9/17 08:48",0,0,0,9,0,1],["hostspot","C++","2/17/16 19:15",0,0,0,4,0,0],["IPScanner","Python","4/17/16 14:03",0,0,0,13,0,1],["kronos","Java","11/5/17 10:11",0,0,0,5,0,2],["lab-evaluation-code","Python","5/20/17 11:45",1,0,1,3,0,1],["lekhpal","JavaScript","2/25/18 04:24",0,0,0,11,0,1],["linear-equation-solver","C++","7/13/17 05:58",0,0,0,17,0,1],["mongodb-notifications-server","JavaScript","5/29/17 09:53",0,0,0,21,0,1],["MyScripts","Emacs Lisp","9/13/17 15:40",8,0,8,63,0,1],["proxychecker","Shell","3/27/16 06:52",1,0,1,6,0,1],["ProxyMan","Shell","1/20/18 15:09",167,41,167,123,21,5],["ProxyMan-Fedora","Shell","9/18/16 14:42",0,0,0,12,0,1],["PyJam","Python","11/27/16 16:25",0,0,0,33,0,2],["python-resolver","Python","4/15/16 16:45",3,1,3,17,0,2],["resume","TeX","2/19/18 15:05",1,1,1,58,0,1],["tweelyser","JavaScript","6/24/17 12:38",1,2,1,56,1,3],["wikipedia-js","JavaScript","4/3/16 11:07",0,0,0,13,0,1],["youtube-audio","Python","4/15/16 10:14",1,0,1,3,0,1],["youtube-downloader-qt","Python","10/31/16 08:34",1,0,1,5,0,1]]

raw_data = sys.argv[1]

temp_data = list(raw_data.split(','))
data = []

for i in range(int(len(temp_data)/9)):
    a = int(i*9)

    # temp = (data_x[a],data_x[a+1],data_x[a+3],data_x[a+4],data_x[a+5],data_x[a+6],data_x[a+7],data_x[a+8])
    # temp2 = list(map(str,temp))

    temp = (temp_data[a],temp_data[a+1],temp_data[a+3],temp_data[a+4],temp_data[a+5],temp_data[a+6],temp_data[a+7],temp_data[a+8])
    temp2 = list(map(str,temp))
    data.append(temp2)
    

today = strftime('%m/%d/%y %H:%M', gmtime())
FMT = '%m/%d/%y %H:%M'

for i in range (len(data)):

    for j in range(3,8):
        if data[i][j] == '':
            data[i][j] = '0'

    # st = data[i][2]
    # delta = datetime.datetime.strptime(today, FMT) - datetime.datetime.strptime(st,FMT)
    # seconds = (delta.days*86400) + delta.seconds
    # data[i][2] = int(seconds/(60*24))
    data[i][2]  = float(data[i][2]) * 1000

# print(data)

for i in range(len(data)):
    temp = data[i]
    temp2 = list(map(str,temp))

    for j in range(2,8):
        temp2[j] = float(temp2[j])

    lang = temp2[1]

    if (lang in languages):
        repositories[lang].append(temp2[2:])
        repo_names[lang].append(temp2[0])
    else:
        repositories['extra'].append(temp2[2:])
        repo_names['extra'].append(temp2[0])

# print(repositories)

for key in repositories:
    # print(repositories[key])
    if len(repositories[key]) != 0 and key != 'extra':
        predictions[key] = models[key].predict(repositories[key]).tolist()

final_predictions = []

for i in range(len(data)):
    key = data[i][1]
    
    if key == '':
        final_predictions.append(0)
    elif key not in languages:
        final_predictions.append(0)
    else:
        point = count[key]
        final_predictions.append(predictions[key][point])
        count[key] = count[key] + 1


for i in range(len(final_predictions)):
    if final_predictions[i] != -1:
        final_predictions[i] = float((final_predictions[i]/4283703.80381)*500)
    if final_predictions[i] > 500:
        final_predictions[i] = 500
# print(predictions)
print(final_predictions)
# print(count)

sys.stdout.flush()
