var command=environment["sun.java.command"];
var match=command.match(/ (.+)\/makesvg/);
var dir;
if (match) {
    dir = match[1];
} else {
    dir = ".";
}
print ("loading libraries from `"+dir+"/engine' ...");
load(dir+"/engine/2d.js");
load(dir+"/engine/buhin.js");
load(dir+"/engine/curve.js");
load(dir+"/engine/kage.js");
load(dir+"/engine/kagecd.js");
load(dir+"/engine/kagedf.js");
load(dir+"/engine/polygon.js");
load(dir+"/engine/polygons.js");

if(arguments.length != 1){
  print("ERROR: input the target name");
  quit();
}
target = arguments[0];

dirname = "./"+target+".work";
dir = new java.io.File(dirname);
if(!dir.exists()){
  dir.mkdir();
}

function stacktrace() { 
  function st2(f) {
    return !f ? [] : 
        st2(f.caller).concat([f.toString().split('(')[0].substring(9) + '(' + f.arguments.join(',') + ')']);
  }
  return st2(arguments.callee.caller);
}

fis = new java.io.FileInputStream("./" + target + ".source");
isr = new java.io.InputStreamReader(fis);
br = new java.io.BufferedReader(isr);

while((line = br.readLine()) != null){
  tab = line.indexOf("\t");
  code = line.substring(0, tab);
  data = line.substring(tab + 1, line.length());
  if(data.length() > 0){
    var kage = new Kage();
    var polygons = new Polygons();

    try {
    //kage.kUseCurve = true;
    kage.kUseCurve = false;

    kage.kBuhin.push("temp", data + "");
    kage.makeGlyph(polygons, "temp");
    } catch (e) {
       continue; 
    }

    fos = new java.io.FileOutputStream(dirname + "/" + code + ".svg");
    osw = new java.io.OutputStreamWriter(fos);
    bw = new java.io.BufferedWriter(osw);

    bw.write(polygons.generateSVG(false));
    //bw.write(polygons.generateSVGFont(false));

    bw.close();
    osw.close();
    fos.close();
  }
}
br.close();
isr.close();
fis.close();
