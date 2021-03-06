const express = require('express');
const router = express.Router();
const axios = require("axios"); 
const cheerio = require("cheerio");
let cgv = [];
let lotte = [];
let trailerKey = [];
let a = [];
let aa = [];

function getCgv(){
    const getHTML = async() => {
        try{
            return await axios.get("http://www.cgv.co.kr/movies/?lt=1&ft=1");
        }catch(err){
            console.log(err);
        }   
    }
    
    const parsing =async() => {
        const html = await getHTML();
        const $ = cheerio.load(html.data);
        const $coureList = $(".sect-movie-chart > ol > li");

        
    
        
    
    $coureList.each((idx, node) => {
        
        cgv.push({
            company: "CGV",
            title: $(node).find(".title").text(),
            percent: $(node).find(".percent").text(),
            open: $(node).find(".txt-info").text().replace(/\n/g, "").replace(/\s*/g, ""),
            img: $(node).find(".thumb-image > img").attr("src"),
            age: $(node).find(".thumb-image > span").text(),
            key: $(node).find(".box-image > a").attr("href")
        })
        
    });

}


    parsing();

}

function getLotte(){
    const getHTML = async() => {
        try{

            var dic = {"MethodName":"GetMoviesToBe","channelType":"HO","osType":"Chrome","osVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.82 Safari/537.36","multiLanguageID":"KR","division":1,"moviePlayYN":"Y","orderType":"1","blockSize":100,"pageNo":1,"memberOnNo":""}

            return await axios.post("https://www.lottecinema.co.kr/LCWS/Movie/MovieData.aspx",  'ParamList='+JSON.stringify(dic));
        }catch(err){
            console.log(err);
        }   
    }
    
    const parsing =async() => {
        const html = await getHTML();

        const Movies = html.data.Movies.Items;
        
        
        for(let i = 0; i < Movies.length;i++){
            lotte.push({
                company:  "LOTTE",
                title: Movies[i].MovieNameKR,
                genre: Movies[i].MovieGenreName,
                img: Movies[i].PosterURL,
                age: Movies[i].ViewGradeNameKR,
                percent: Movies[i].BookingRate,
                key: Movies[i].RepresentationMovieCode
            });
            trailerKey.push(Movies[i].RepresentationMovieCode);
        }
        
        return trailerKey;
}
    
     t = parsing();
}

function getTrailer() {
    const trailerImg = async() => {

       
        trailerKey = await t;
        
        for(let i = 0; i < 10; i++){
            if(trailerKey[i] === "AD"){
                continue;
            }else {
                
                    var dic = {"MethodName":"GetMovieDetailTOBE","channelType":"HO","osType":"Chrome","osVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36","multiLanguageID":"KR","representationMovieCode":`${trailerKey[i]}`,"memberOnNo":""}
        
                    const html = await axios.post("https://www.lottecinema.co.kr/LCWS/Movie/MovieData.aspx", 'ParamList='+JSON.stringify(dic));
                    const name = html.data.Movie.MovieNameKR;
                    const imgUrl = html.data.Trailer.Items[0].ImageURL;
                    a.push(
                        {   num:i,
                            key:trailerKey[i],
                        mp4 : `https://caching.lottecinema.co.kr//Media/MovieFile/MovieMedia/202204/${trailerKey[i]}_301_1.mp4`, 
                        img : imgUrl,
                        name: name }
                    );
            
                
                
            }
           
        }
    };
        
        

    trailerImg();
}

function getMovieDetail() {
    const detail = async() => {

       
        key = await t;
        console.log(key);
        for(let i = 0; i < 10; i++){
            if(key[i] === "AD"){
                continue;
            }else {
                    console.log(key[i]);
                    var dic = {"MethodName":"GetMovieDetailTOBE","channelType":"HO","osType":"Chrome","osVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36","multiLanguageID":"KR","representationMovieCode":`${key[i]}`,"memberOnNo":""}
        
                    const html = await axios.post("https://www.lottecinema.co.kr/LCWS/Movie/MovieData.aspx", 'ParamList='+JSON.stringify(dic));
                    const name = [];
                    const image = [];
                    for(let b = 0; b < html.data.Casting.Items.length; b++){
                         name.push(html.data.Casting.Items[b].StaffName);
                         image.push(html.data.Casting.Items[b].StaffImage);
                    }
                    
                    const synopsis = html.data.Movie.SynopsisKR;
                    console.log(synopsis);
                    
            }
           
        }
    };
        
        

    detail();
}

getCgv();
getLotte();
getTrailer();
getMovieDetail();

router.get('/', (req, res)=>{
  res.send({
      cgv: cgv,
      lotte: lotte,
      trailer: a
    });
});

module.exports = router;


