var cheerio = require('cheerio');
var request = require('request');



urls = ['http://www.redcross.org', 'https://www.nature.org'];

getLogos(urls);

// return false if it errors
function getLogos(urls){
  for (var i = 0; i < urls.length; i++){
    url = urls[i];
    console.log(url);
    try {
      wrappedRequest = Meteor.wrapAsync(request);
      res = wrappedRequest({url: url, timeout: 10000});

      if (res.statusCode == 200){
        html = res.body;
      } else {
        console.log("bad status code", res, url);
        return false;
      }
    } catch(e) {
      console.log("error", e, url);
      return false;
    }
    $ = cheerio.load(html);
    logoUrl = $("#site-logo img").attr("src");


    if (!logoUrl) {
      logoUrl = $("img").filter(function(index, elm){
        return $(this).attr("src").includes("logo.png");
      }).eq(0).attr("src");
    }

    if (!logoUrl) console.log("no logo found");
    else{
      // add http if necessary
      console.log(logoUrl);
      console.log(url + logoUrl);
    }


  }


}



// HTTP.methods({
//   '/detect': function(data){
//     var url = this.query.url;
//
//     features = extractFeatures(url);
//     if (!features){
//       return {error: true}
//     }
//     featureArray = [];
//     for (key in features){
//       featureArray.push(features[key]);
//     }
//     result = neuralNet(featureArray)[0];
//     returnObject = {error:false};
//     returnObject.result = result;
//     if (result > .8){
//       returnObject.fake = true;
//     } else {
//       returnObject.fake = false;
//     }
//
//     // handle deviations
//     if (returnObject.fake == true){
//       var shortenedURL = url.replace("http://", "").replace("https://", "").replace("www.", "");
//       var match = false;
//       for (var i = 0; i < realsites.length; i++){
//         var site = realsites[i];
//         site = site.replace("http://", "").replace("https://", "").replace("www.", "");
//         if (site == shortenedURL){
//           match = true;
//           break;
//         }
//       }
//       if (match){
//         console.log("Note 1: Adjusted result for " + url + ": original prediction was " + result + ", was changed to real");
//         returnObject.fake = false;
//       }
//     }
//
//     return returnObject;
//
//   }
// });
