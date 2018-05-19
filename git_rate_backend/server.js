var express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs')
var http = require('http').createServer(app);
app.use(cors())
app.use(express.static('./Public'));
app.use(bodyParser.urlencoded({ extended: true }));;
http.listen(process.env.PORT || 5000);
var fetch = require('node-fetch');
var HttpsProxyAgent = require('https-proxy-agent');
var parse = require('parse-link-header');
var Papa = require("papaparse");
var spawn = require("child_process").spawn;
var spawnSync = require('spawn-sync')
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const client_id = 'fe1bcc900fac67e26d7c'
const client_secret = '0871e55b1a0c9c7d52b3c6c097a647fb28718b9c'
const per_page = 100
const proxy = 'http://icm2015003:9158555203@172.31.1.4:8080'
var univ_array = [50,72,89,151,23,34,21,13,45,2,4,7,9,5,23,12,57,98,9,6,5,2,1,7,8,12,32,44,45,121,34,65,34,32,12,54,98,99,89,89,34,2,12,3,4,1,0.2,0.4,0.6,0.8,0.9,0.34,0.456,0.12,0.34,345,543,124,532,134,567,345,543,234,432,321,323,654,345]

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use('/public', express.static(__dirname + '/Public'));
var langpref;

app.post('/upload/:orgname', (req, res, next) => {
  console.log(req.params.orgname);
  let imageFile = req.files.file;
  var val = (req.body.text).toString();
  console.log(val)
  langpref = val.split(",")
  console.log(langpref.length)

  imageFile.mv(__dirname+"/Public/"+req.params.orgname+".csv", function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.json({file: "Public/"+req.body.filename+".csv"});
  });

})

app.get('/organ/result/:orgname',async function(req,res){
        var csvfile = './Public/'+req.params.orgname+".csv"
        var content = fs.readFileSync(csvfile, "utf8");
        var result;
        var user_rank_array = []
        var array = []
        var final_array = []
        var resp_array = []
        Papa.parse(content, {
            header: true,
            delimiter: "\n",
            skipEmptyLines: true,
            complete: async function(result){
                var len = result.data.length
                for(let i=0;i<len;i++)
                {
                    array.push(result.data[i].name)
                }
                console.log(array)
                var arr_len = array.length
                for(let j=0;j<arr_len;j++)
                {
                        var username = array[j]
                        var user_rank = 0
                        var user = await getUser(username)
                        console.log("user")
                        var repos = await getAllRepos(username)
                        if(langpref.length>1)
                        {
                            console.log(langpref.length)
                            console.log("greater")
                            var arr = await createArray2(repos)
                        }
                        else if(langpref.length==1&&langpref[0]==""){
                            console.log(langpref.length)
                            console.log("zero")
                            var arr = await createArray(repos)
                        }
                        else{
                            console.log(langpref.length)
                            console.log("greater")
                            var arr = await createArray2(repos)                            
                        }
                        var arr1 = JSON.stringify(arr)
                        final_array.push(arr1)
                        final_array.push("\"####\"")                  
                }
                console.log(final_array)
                    var pythonProcess = await spawn('python3', ["./model2.py",final_array]);
    await pythonProcess.stdout.on('data', function (data) {
        console.log(data.toString())
        user_rank_array = JSON.parse(data.toString())
        console.log(user_rank_array)
        var l = user_rank_array.length
        for(let i=0;i<l;i++)
        {
            var obj = {}
            obj={username:array[i],
                rating:user_rank_array[i]}
                resp_array.push(obj);
        }
        res.send({arr:resp_array})
    })

            }
        });
	
});

// error handler

app.get('/user/ranking/:username', async function (req, res) {
    try{

    var percentile;
    var perc_score = 0;
    var rank_array
    var user_rank = 0
    var username = req.params.username
    var user = await getUser(username)
    console.log(user)
    var repos = await getAllRepos(username)
    var arr = await createArray(repos)
    var arr1 = JSON.stringify(arr)
    console.log(arr1)
    var pythonProcess = await spawn('python3', ["./model.py",arr]);
    await pythonProcess.stdout.on('data', function (data) {
        console.log(data.toString())
        rank_array = JSON.parse(data.toString())
        var len = rank_array.length
        for(let i =0;i<len;i++)
        {
           repos[i].ranking = rank_array[i]
           user_rank+=rank_array[i]
        }
    user_rank+=(0.2*user.commits_count)+(0.5*user.followers)
        var l = univ_array.length;
        for(let k =0;k<l;k++)
        {
            if(user_rank>=univ_array[k])
            {
                perc_score++;
            }
        }
        percentile = perc_score / l;
        user.ranking = user_rank
        // if(univ_array.includes(user_rank)==false)
        // {
        //     univ_array.push(user_rank)
        // }
        res.send({
            user:user,
        repos:repos,
    percentile:percentile})
    })
    
    }
    catch(e)
    {
        console.log(e)
    }
})


async function getUser(username) {
    try {
        let response = await fetch(`https://api.github.com/users/${username}?client_id=${client_id}&client_secret=${client_secret}`)
        let userinfo = await response.json()
        let repoCount = await getReposCount(userinfo.repos_url)
        let eventsUrl = userinfo.events_url.split('{')[0]
        let commitsCount = await getCommitsCount(eventsUrl)
        userinfo.commits_count = commitsCount
        userinfo.repo_count = repoCount
        return userinfo

    }
    catch (e) {

    }
}

async function createArray(repos)
{
    try{

    
    var len =repos.length;
    var arr = new Array(len)
    for(let i =0;i<len;i++)
    {
        arr[i]=new Array(9)
    }
    for(let i=0;i<len;i++)
    {
        
            arr[i][0]=repos[i].name
            arr[i][1]=repos[i].language
            var str = repos[i].pushed_at
            var d = new Date(str);
            var year = d.getFullYear().toString();
            year = year.substr(2);
            var f_date = (d.getMonth()+1)+"/"+d.getDate()+"/"+year
            var time = str.split('T')[1].split('Z')[0]
            time = time.substr(0,5)
            var f_str = f_date+" "+time
            arr[i][2]=f_str
            arr[i][3]=repos[i].stargazers_count
            arr[i][4]=repos[i].forks_count
            arr[i][5]=repos[i].watchers
            arr[i][6]=repos[i].commit_count
            arr[i][7]=repos[i].open_issues
            arr[i][8]=repos[i].contri_count
        
    }
    return arr
}
catch(e)
{

}
}

async function createArray2(repos)
{
    try{

    
    var len =repos.length;
    var arr = new Array()
    var k =0;
    for(let i=0;i<len;i++)
    {
    
            if(langpref.includes(repos[i].language)==true)
            {
                arr[k] = new Array(9)
            arr[k][0]=repos[i].name
            arr[k][1]=repos[i].language
            var str = repos[i].pushed_at
            var d = new Date(str);
            var year = d.getFullYear().toString();
            year = year.substr(2);
            var f_date = (d.getMonth()+1)+"/"+d.getDate()+"/"+year
            var time = str.split('T')[1].split('Z')[0]
            time = time.substr(0,5)
            var f_str = f_date+" "+time
            arr[k][2]=f_str
            arr[k][3]=repos[i].stargazers_count
            arr[k][4]=repos[i].forks_count
            arr[k][5]=repos[i].watchers
            arr[k][6]=repos[i].commit_count
            arr[k][7]=repos[i].open_issues
            arr[k][8]=repos[i].contri_count
            k++;
            }

        
    }
    return arr
}
catch(e)
{

}
}

async function getContributors(contriUrl) {
    try {

        let totalContri = 0
        let response, linkHeader, responseJson, parsed, totalPages

        // first fetch
        response = await fetch(contriUrl + `?per_page=${per_page}&client_id=${client_id}&client_secret=${client_secret}`)
        linkHeader = response.headers.get('Link')
        responseJson = await response.json()

        if (linkHeader == null) {
            return responseJson.length
        }

        parsed = parse(linkHeader)
        totalPages = parsed.last.page

        // second fetch
        response = await fetch(contriUrl + `?page=${totalPages}&per_page=${per_page}&client_id=${client_id}&client_secret=${client_secret}`)
        responseJson = await response.json()

        totalContri = 100 * (totalPages - 1) + responseJson.length
        return (totalContri)
    }
    catch (e) {

    }

}

async function getReposCount(repos_url) {
    try {
        let totalRepos = 0;
        let response, linkHeader, responseJson, parsed, totalPages

        // first fetch
        response = await fetch(repos_url + `?per_page=${per_page}&client_id=${client_id}&client_secret=${client_secret}`)
        //console.log(response)
        linkHeader = response.headers.get('Link')
        responseJson = await response.json()
        for (let i = 0; i < responseJson.length; i++) {
            if (responseJson[i].fork == false) {
                totalRepos++
            }
        }

        if (linkHeader == null) {
            return totalRepos
        }

        parsed = parse(linkHeader)
        totalPages = parsed.last.page

        // second fetch
        for (let r = 0; r <= totalPages; r++) {
            response = await fetch(repos_url + `?page=${r}&per_page=${per_page}&client_id=${client_id}&client_secret=${client_secret}`)
            responseJson = await response.json()

            for (let i = 0; i < responseJson.length; i++) {
                if (responseJson[i].fork == false) {
                    totalRepos++
                }
            }
        }

        return totalRepos
    }
    catch (e) {

    }
}

async function getAllRepos(username) {
    try {
        let frepos = []
        let response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&client_id=${client_id}&client_secret=${client_secret}`)
        let repos = await response.json()
        let commitUrls = repos.map(repo => repo.commits_url.split('{')[0])
        let commitCountPromises = commitUrls.map(async (url) => { return await countCommits(url) })
        let contriUrls = repos.map(repo => repo.contributors_url)
        let contriCountPromises = contriUrls.map(async (curl) => { return await getContributors(curl) })
        var data = await Promise.all(commitCountPromises).then(async (commitCount) => {
            for (let i = 0; i < repos.length; i++) {
                repos[i]['commit_count'] = commitCount[i]

            }
            var dat = await Promise.all(contriCountPromises).then((contriCount) => {
                //console.log(contriCount)
                let k = 0
                for (let j = 0; j < repos.length; j++) {
                    repos[j]['contri_count'] = contriCount[j]
                    if (repos[j]['fork'] === false) {
                        frepos[k] = (repos[j])
                        k++

                    }
                }
                return frepos

            })
            return dat
        })
        return data

    }
    catch (e) {
    }
};

async function countCommits(commitUrl) {
    try {


        let totalCommits = 0
        let response, linkHeader, responseJson, parsed, totalPages

        // first fetch
        response = await fetch(commitUrl + `?per_page=${per_page}&client_id=${client_id}&client_secret=${client_secret}`)
        linkHeader = response.headers.get('Link')
        responseJson = await response.json()

        if (linkHeader == null) {
            return responseJson.length
        }

        parsed = parse(linkHeader)
        totalPages = parsed.last.page

        // second fetch
        response = await fetch(commitUrl + `?page=${totalPages}&per_page=${per_page}&client_id=${client_id}&client_secret=${client_secret}`)
        responseJson = await response.json()

        totalCommits = 100 * (totalPages - 1) + responseJson.length
        return totalCommits
    }
    catch (e) {
    }
}

async function getCommitsCount(eventsUrl) {
    try {
        let totalCommits = 0
        let response, linkHeader, responseJson, parsed, totalPages
        //first fetch
        response = await fetch(eventsUrl + `?per_page=${per_page}&client_id=${client_id}&client_secret=${client_secret}`)
        linkHeader = response.headers.get('Link')
        responseJson = await response.json()
        if (linkHeader == null) {
            for (let i = 0; i < responseJson.length; i++) {
                if (responseJson[i].type == 'PushEvent') {
                    var flag = 0
                    totalCommits += responseJson[i].payload.commits.length
                }
            }
            return totalCommits
        }
        parsed = parse(linkHeader)
        totalPages = parsed.last.page
        for (let c = 2; c <= totalPages; c++) {
            response = await fetch(eventsUrl + `?page=${c}&per_page=${per_page}&client_id=${client_id}&client_secret=${client_secret}`)
            responseJson = await response.json()
            for (let i = 0; i < responseJson.length; i++) {
                if (responseJson[i].type == 'PushEvent') {
                    totalCommits += responseJson[i].payload.commits.length
                }
            }

        }
        return totalCommits

    }
    catch (e) {

    }
}