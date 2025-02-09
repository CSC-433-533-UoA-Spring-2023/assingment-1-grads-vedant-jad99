/*
  Basic File I/O for displaying
  Skeleton Author: Joshua A. Levine
  Modified by: Amir Mohammad Esmaieeli Sikaroudi
  Email: amesmaieeli@email.arizona.edu
*/


//access DOM elements we'll use
var input = document.getElementById("load_image");
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// The width and height of the image
var width = 0;
var height = 0;
// The image data
var ppm_img_data;

var theta = 0; // Angle in degrees
var rotationSpeed = 2;
var imgSize = 600;

//Function to process upload
var upload = function () {
    if (input.files.length > 0) {
        var file = input.files[0];
        console.log("You chose", file.name);
        if (file.type) console.log("It has type", file.type);
        var fReader = new FileReader();
        fReader.readAsBinaryString(file);

        fReader.onload = function(e) {
            //if successful, file data has the contents of the uploaded file
            var file_data = fReader.result;
            parsePPM(file_data);

            /*
             * Modify length of canvas to be of size 600 x 600
             */
            canvas.width = imgSize;
            canvas.height = imgSize;
            setTimeout(rotationFunction, 500);
        }
    }
}

/*
 * Function to rotate the image and apply animation.
 */
function rotationFunction() {
    /* Clear the canvas and create new image blob */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var newImageData = ctx.createImageData(imgSize, imgSize);

    /*
     * Calculate the scaling factor based on the angle of rotation.
     * We calculate this to make the image corners fit into the
     * canvas.
     */
    var radians = GetRadiansFromDegrees(theta);
    var scaleFactor = Math.min(
        imgSize / (width * Math.abs(Math.cos(radians)) + height * Math.abs(Math.sin(radians))),
        imgSize / (width * Math.abs(Math.sin(radians)) + height * Math.abs(Math.cos(radians)))
    );
    var scaleMatrix = GetScalingMatrix(scaleFactor, scaleFactor);                   // Scaling matrix

    /*
     * Calculate the rotation, translation, final transformaiton and inverse transformation matrices.
     * Rotate: Rotate the image by angle ``theta``
     * Translate1: Move the top of the image to the center of the canvas.
     * Translate2: Move the top of the image to the leftmost corner (back to the original frame).
     */
    var rotationMatrix = GetRotationMatrix(theta);
    var centerImage = GetTranslationMatrix(-width / 2, -height / 2);
    var fitFrameTranslation = GetTranslationMatrix(300, 300);
    var transformationMatrix =
    MultiplyMatrixMatrix(fitFrameTranslation,
    MultiplyMatrixMatrix(rotationMatrix,
    MultiplyMatrixMatrix(scaleMatrix, centerImage)));

    var transformationMatrixInv = InverseMatrix3x3(transformationMatrix);

    /*
     * Inverse mapping function. Map output to corresponding input picture.
     */
    for (var j = 0; j < imgSize; j++) {
        for (var i = 0; i < imgSize; i++) {
            var pixel = [i, j, 1];
            var origPixel = MultiplyMatrixVector(transformationMatrixInv, pixel);
            var origX = Math.round(origPixel[0]);
            var origY = Math.round(origPixel[1]);

            if (origX >= 0 && origX < width && origY >= 0 && origY < height) {
                var origIndex = (origY * width + origX) * 4;
                setPixelColor(newImageData, [i, j], origIndex);
            }
        }
    }

    /*
     * Update theta, render image and update frame.
     */
    theta = (theta + rotationSpeed) % 360;
    ctx.putImageData(newImageData, 0, 0);
    requestAnimationFrame(rotationFunction);
}

// Show transformation matrix on HTML
function showMatrix(matrix){
    for(let i=0;i<matrix.length;i++){
        for(let j=0;j<matrix[i].length;j++){
            matrix[i][j]=Math.floor((matrix[i][j]*100))/100;
        }
    }
    document.getElementById("row1").innerHTML = "row 1:[ " + matrix[0].toString().replaceAll(",",",\t") + " ]";
    document.getElementById("row2").innerHTML = "row 2:[ " + matrix[1].toString().replaceAll(",",",\t") + " ]";
    document.getElementById("row3").innerHTML = "row 3:[ " + matrix[2].toString().replaceAll(",",",\t") + " ]";
}

// Sets the color of a pixel in the new image data
// Modify the function to set image values based on reverse mapping.
function setPixelColor(imageData, pixel, origIndex) {
    var index = (pixel[1] * imageData.width + pixel[0]) * 4;

    imageData.data[index + 0] = ppm_img_data.data[origIndex + 0];
    imageData.data[index + 1] = ppm_img_data.data[origIndex + 1];
    imageData.data[index + 2] = ppm_img_data.data[origIndex + 2];
    imageData.data[index + 3] = 255;
}

// Load PPM Image to Canvas
// Untouched from the original code
function parsePPM(file_data){
    /*
     * Extract header
     */
    var format = "";
    var max_v = 0;
    var lines = file_data.split(/#[^\n]*\s*|\s+/); // split text by whitespace or text following '#' ending with whitespace
    var counter = 0;
    // get attributes
    for(var i = 0; i < lines.length; i ++){
        if(lines[i].length == 0) {continue;} //in case, it gets nothing, just skip it
        if(counter == 0){
            format = lines[i];
        }else if(counter == 1){
            width = lines[i];
        }else if(counter == 2){
            height = lines[i];
        }else if(counter == 3){
            max_v = Number(lines[i]);
        }else if(counter > 3){
            break;
        }
        counter ++;
    }
    console.log("Format: " + format);
    console.log("Width: " + width);
    console.log("Height: " + height);
    console.log("Max Value: " + max_v);
    /*
     * Extract Pixel Data
     */
    var bytes = new Uint8Array(3 * width * height);  // i-th R pixel is at 3 * i; i-th G is at 3 * i + 1; etc.
    // i-th pixel is on Row i / width and on Column i % width
    // Raw data must be last 3 X W X H bytes of the image file
    var raw_data = file_data.substring(file_data.length - width * height * 3);
    for(var i = 0; i < width * height * 3; i ++){
        // convert raw data byte-by-byte
        bytes[i] = raw_data.charCodeAt(i);
    }
    // update width and height of canvas
    document.getElementById("canvas").setAttribute("width", window.innerWidth);
    document.getElementById("canvas").setAttribute("height", window.innerHeight);
    // create ImageData object
    var image_data = ctx.createImageData(width, height);
    // fill ImageData
    for(var i = 0; i < image_data.data.length; i+= 4){
        let pixel_pos = parseInt(i / 4);
        image_data.data[i + 0] = bytes[pixel_pos * 3 + 0]; // Red ~ i + 0
        image_data.data[i + 1] = bytes[pixel_pos * 3 + 1]; // Green ~ i + 1
        image_data.data[i + 2] = bytes[pixel_pos * 3 + 2]; // Blue ~ i + 2
        image_data.data[i + 3] = 255; // A channel is deafult to 255
    }
    ctx.putImageData(image_data, canvas.width/2 - width/2, canvas.height/2 - height/2);
    //ppm_img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);   // This gives more than just the image I want??? I think it grabs white space from top left?
    ppm_img_data = image_data;
}

//Connect event listeners
input.addEventListener("change", upload);

