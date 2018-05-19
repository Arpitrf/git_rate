import random

outfile = open("shelldata2.txt", "w") 


for i in range(1, 1000):
	stars = random.randint(0,200)
	forks = random.randint(0,300)
	watchers = random.randint(0,250)
	commits = random.randint(0, 1000)
	issues = random.randint(0,150)
	contri = random.randint(1,30)
	stri = '06/24/17 09:27,' + str(stars) + ',' + str(forks) + ',' + str(watchers) + ',' + str(commits) + ',' + str(issues) + ',' + str(contri) + '\n'
	outfile.write(stri)  # trailing ',' omits newline character

outfile.close()
