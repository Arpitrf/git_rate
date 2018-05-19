from sklearn.neural_network import MLPRegressor
import numpy as np
import datetime
import math
from time import gmtime, strftime
from sklearn.externals import joblib
import matplotlib.pyplot as plt

def normalize(data):
    m = np.mean(data, axis = 0)
    st_dev = np.std(data, axis = 0)
    print (m, st_dev)
    return (data - m)/st_dev

def rating(data):
    labels = []

    # C : 2 - Time, 10 - Stars, 6 - Forks, 8 - Watchers, 7 - commit_count, 4 - open_issues , 8-contributors
    # JS : 2 - Time, 6 - Stars, 4 - Forks, 5 - Watchers, 7 - commit_count, 4 - open_issues , 6-contributors
    # C# : 2 - Time, 8 - Stars, 6 - Forks, 6 - Watchers, 7 - commit_count, 7 - open_issues , 7-contributors
    # Python : 2 - Time, 6 - Stars, 4 - Forks, 5 - Watchers, 7 - commit_count, 4 - open_issues , 6-contributors
    # Shell : 2 - Time, 10 - Stars, 8 - Forks, 7 - Watchers, 8 - commit_count, 5 - open_issues , 7-contributors
    # HTML : 2 - Time, 4 - Stars, 4 - Forks, 4 - Watchers, 4 - commit_count, 3 - open_issues , 4-contributors
    # CSS : 2 - Time, 4 - Stars, 4 - Forks, 4 - Watchers, 4 - commit_count, 3 - open_issues , 4-contributors
    # CPP : 2 - Time, 10 - Stars, 6 - Forks, 8 - Watchers, 7 - commit_count, 4 - open_issues , 8-contributors
    # GO : 2 - Time, 7 - Stars, 6 - Forks, 6 - Watchers, 8 - commit_count, 5 - open_issues , 6-contributors
    # JAVA : 2 - Time, 6 - Stars, 5 - Forks, 5 - Watchers, 5 - commit_count, 4 - open_issues , 4-contributors
 
    for i in range (len(data)):
        r = 10*data[i][0] + 6*data[i][1] + 8*data[i][2] + 7*data[i][3] + 4*data[i][4]  + 8*data[i][5]  
        labels.append(r)

    return labels

data_temp = np.loadtxt("Cdata2.txt",dtype=np.str,delimiter=",")
data = data_temp[::,1:7]

# labels = data_temp[::,3:4]
# labels2 = np.reshape(labels,(labels.shape[0],))
# print (labels2)

today = strftime('%m/%d/%y %H:%M', gmtime())
FMT = '%m/%d/%y %H:%M'

# print(today)

for i in range (len(data)):
    # st = data[i][0]
    # # print (st)
    # delta = datetime.datetime.strptime(today, FMT) - datetime.datetime.strptime(st,FMT)
    # seconds = (delta.days*86400) + delta.seconds
    # data[i][0] = int(seconds/(60*24))
    # print (seconds,data[i][0])
    data[i][0]  = float(data[i][0]) * 100

data2 = data.astype(np.float)

#print(data2)

# data_norm = normalize(data2)
data_norm = data2
labels2 = rating(data_norm)

# print (data_norm,labels2)

clf = MLPRegressor(verbose = False, learning_rate_init = 0.001, max_iter = 10000)
clf.fit(data_norm,labels2)
# print(labels2)

test = [['0','0','0','0','0','0'],['20','82','520','190','400','11'],['12','3867','549','554','6745','262'],['167','41','10','123','20','5'],['1250','600','500','2000','50','50']]

for i in range (len(test)):
    # delta = datetime.datetime.strptime(today, FMT) - datetime.datetime.strptime(test[i][0],FMT)
    # seconds = (delta.days*86400) + delta.seconds
    # test[i][0] = int(seconds/(60*24))
    test[i][0] = float(test[i][0]) * 1000
    test[i][1] = float(test[i][1])
    test[i][2] = float(test[i][2])
    test[i][3] = float(test[i][3])
    test[i][4] = float(test[i][4])
    test[i][5] = float(test[i][5])

m = np.mean(data2, axis = 0)
st_dev = np.std(data2, axis = 0)

# test2 = (test - m)/st_dev
test2 = test
# print(test2)

pred = clf.predict(test2)

for i in range(len(pred)):
    print(pred[i])
    pred[i] = float((pred[i]/pred[3])*500)
    # print(pred[i]/pred[2])
    # pred[i] = (((1/(1+math.exp(-1*(1+pred[i]/pred[2]))))*2)-1)*500

print(pred)
plt.plot([test[0][0], test[1][0], test[2][0], test[3][0]], [pred[0], pred[1], pred[2], pred[3]], 'ro')
plt.show()

# filename = 'C_model.sav'
# joblib.dump(clf, filename)

filename = 'C_model2.sav'
joblib.dump(clf, filename)