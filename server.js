const express       =    require("express")
const fs            =    require("fs")

const app = express();

app.get('/',(req,res)=>{
   
    fs.stat("Prada.MKV", function(err, stats) {
        if (err) {
          if (err.code === 'ENOENT') {
            return res.sendStatus(404);
          }
        res.end(err);
        }

        var range = req.headers.range;
        if (!range) {
            res.writeHead(200,{"Content-Type":"video/mp4"})
            var stream = fs.createReadStream("Prada.MKV")
               .on("open", function() {
                   stream.pipe(res);
              }) .on("error", function(err) {
                   res.end(err);
            });
            return;
            //retrun out of everything
        }
        
        var positions = range.replace(/bytes=/, "").split("-");
        var start = parseInt(positions[0], 10);
        var total = stats.size;
        var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        var chunksize = (end - start) + 1;

        res.writeHead(206, {
            "Content-Range": "bytes " + start + "-" + end + "/" + total,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4"
        });

        
        var stream = fs.createReadStream("Prada.MKV", { start: start, end: end })
            .on("open", function() {
            stream.pipe(res);
            }).on("error", function(err) {
            res.end(err);
            });
    });
 });


const PORT = 5000
app.listen(PORT,()=>{
    console.log("Our server is running"+" "+PORT);
})