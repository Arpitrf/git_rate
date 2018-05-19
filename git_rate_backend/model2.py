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

answer = []
answer_sum = []
# repositories = dict()

# raw_data = '[["21Lane","Python","1/7/17 18:04",4,1,4,289,1,1],["cool-physics","HTML","1/28/18 07:19",12,4,12,38,5,4],["dummy","","1/21/17 13:27",0,0,0,"",0,""],["experiment","C","5/26/16 07:13",0,1,0,8,0,1],["foss-profile-templates","HTML","9/19/16 15:34",1,6,1,34,1,7],["gmail-notifier-gtk","Python","3/9/17 08:48",0,0,0,9,0,1],["hostspot","C++","2/17/16 19:15",0,0,0,4,0,0],["IPScanner","Python","4/17/16 14:03",0,0,0,13,0,1],["kronos","Java","11/5/17 10:11",0,0,0,5,0,2],["lab-evaluation-code","Python","5/20/17 11:45",1,0,1,3,0,1],["lekhpal","JavaScript","2/25/18 04:24",0,0,0,11,0,1],["linear-equation-solver","C++","7/13/17 05:58",0,0,0,17,0,1],["mongodb-notifications-server","JavaScript","5/29/17 09:53",0,0,0,21,0,1],["MyScripts","Emacs Lisp","9/13/17 15:40",8,0,8,63,0,1],["proxychecker","Shell","3/27/16 06:52",1,0,1,6,0,1],["ProxyMan","Shell","1/20/18 15:09",168,40,168,123,23,5],["ProxyMan-Fedora","Shell","9/18/16 14:42",0,0,0,12,0,1],["PyJam","Python","11/27/16 16:25",0,0,0,33,0,2],["python-resolver","Python","4/15/16 16:45",3,1,3,17,0,2],["resume","TeX","2/19/18 15:05",2,1,2,58,0,1],["tweelyser","JavaScript","6/24/17 12:38",1,2,1,56,1,3],["wikipedia-js","JavaScript","4/3/16 11:07",0,0,0,13,0,1],["youtube-audio","Python","4/15/16 10:14",1,0,1,3,0,1],["youtube-downloader-qt","Python","10/31/16 08:34",1,0,1,5,0,1]],"####",[["AI_codes","Python","11/25/17 13:55",0,1,0,16,1,1],["announcement_portal","JavaScript","10/29/17 10:28",0,0,0,16,0,1],["ChatRoom","JavaScript","1/25/17 18:52",0,0,0,1,0,1],["cyclo_complexity","Java","9/4/17 11:18",0,0,0,3,0,1],["daa_codes","C","5/2/17 13:18",0,0,0,24,0,1],["data_mining","C++","3/9/18 16:42",0,0,0,1,0,1],["DDOS","Shell","2/20/18 05:55",0,0,0,4,0,1],["Extension1","JavaScript","8/1/17 13:23",0,0,0,3,0,1],["flaskproj","HTML","6/21/17 18:22",0,0,0,2,0,1],["gaganjeetreen.github.io","HTML","7/5/17 19:05",0,0,0,2,0,1],["git_rate","JavaScript","3/17/18 06:41",0,0,0,4,0,2],["graphics","C++","11/15/17 16:31",0,0,0,7,0,1],["handlebars_test","JavaScript","10/31/17 09:38",0,1,0,1,1,1],["hello-world","","5/21/16 06:24",0,0,0,3,0,1],["library_management","Java","8/28/17 09:54",0,0,0,3,0,1],["login","JavaScript","5/27/17 17:58",0,0,0,2,0,1],["networking_lab","C","11/18/17 07:22",0,1,0,11,1,1],["nodejs","JavaScript","1/20/17 10:26",0,0,0,8,0,1],["notifier","JavaScript","5/22/17 15:14",0,0,0,1,0,1],["pattern_matching","Java","8/28/17 19:08",0,0,0,2,0,1],["ProgramRegEx","Java","10/30/17 11:29",0,0,0,1,0,1],["ProjectManager","Java","4/28/17 16:46",0,0,0,2,0,1],["replace_extension","JavaScript","7/31/17 17:20",0,0,0,1,0,1],["smart_lighting","Python","11/19/17 14:53",0,0,0,15,0,2],["tennis_proj","Python","10/31/17 09:39",0,1,0,11,1,1],["To-Do","CSS","1/21/17 14:08",0,0,0,3,0,1],["travelbook","HTML","5/25/17 08:52",0,0,0,2,0,1],["vue_try","JavaScript","6/19/17 05:49",0,0,0,2,0,1],["workspace_backend","JavaScript","1/27/18 11:10",0,0,0,2,0,1],["workspace_login","HTML","1/26/18 19:54",0,0,0,5,0,1]],"####"]' 

raw_data = sys.argv[1]

# print(raw_data)
raw_data2 = raw_data.replace('null','')
# print(raw_data2)
temp_data0 = list(raw_data2.split('"####"'))

for i in range(len(temp_data0)-1):
    temp_data = list(temp_data0[i].split(']'))
    # print(temp_data)

    temp_data2 = []
    for j in  range(len(temp_data)):
        tempstr = temp_data[j]

        if ( temp_data[j] != ''):
            if ( temp_data[j][0] == ',' ):
                tempstr2 = tempstr.replace(',[','')
            elif ( temp_data[j][0] == '['):
                tempstr2 = tempstr.replace('[[','')
        
            temp_data2.append(tempstr2)
    # print(len(temp_data2))

    temp_data3 = []
    for j in range(len(temp_data2)-1):
        tempstr = temp_data2[j]
        tempstr2 = tempstr.replace('"','')
        
        templist_2 = list(map(str,tempstr2.split(',')))

        templist = []
        for index in range(len(templist_2)):
            if index != 2:
                templist.append(templist_2[index])

        # print(templist)
        temp_data3.append(templist)

    # print(temp_data3)

    # today = strftime('%m/%d/%y %H:%M', gmtime())
    # FMT = '%m/%d/%y %H:%M'

    for k in range (len(temp_data3)):

        for j in range(2,8):
            if temp_data3[k][j] == '':
                temp_data3[k][j] = '0'

        # st = temp_data3[k][2]
        # delta = datetime.datetime.strptime(today, FMT) - datetime.datetime.strptime(st,FMT)
        # seconds = (delta.days*86400) + delta.seconds
        # temp_data3[k][2] = int(seconds/(60*24))
        temp_data3[k][2]  = float(temp_data3[k][2]) * 1000

    # print(temp_data3)

    repositories = {'Python':[],'Java':[],'JavaScript':[],'HTML':[],'C':[],'C++':[],'C#':[],'Go':[],'CSS':[],'Shell':[],'extra':[]}
    predictions = dict()
    repo_names = {'Python':[],'Java':[],'JavaScript':[],'HTML':[],'C':[],'C++':[],'C#':[],'Go':[],'CSS':[],'Shell':[],'extra':[]}
    count = {'Python':0,'Java':0,'JavaScript':0,'HTML':0,'C':0,'C++':0,'C#':0,'Go':0,'CSS':0,'Shell':0}

    for j in range(len(temp_data3)):
        temp = temp_data3[j]
        temp2 = list(map(str,temp))

        for k in range(2,8):
            temp2[k] = float(temp2[k])

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

    for j in range(len(temp_data3)):
        key = temp_data3[j][1]
        
        if key == '':
            final_predictions.append(0)
        elif key not in languages:
            final_predictions.append(0)
        else:
            point = count[key]
            final_predictions.append(predictions[key][point])
            count[key] = count[key] + 1


    for j in range(len(final_predictions)):
        if final_predictions[j] != -1:
            final_predictions[j] = float((final_predictions[j]/4283703.80381)*500)
        if final_predictions[j] > 500:
            final_predictions[j] = 500

# # # print(predictions)
    # print(final_predictions)
    answer.append(final_predictions)
# # # print(count)

for i in range(len(answer)):
    sum = 0
    for j in range(len(answer[i])):
        sum = sum + answer[i][j]
    answer_sum.append(sum)

print(answer_sum)

sys.stdout.flush()